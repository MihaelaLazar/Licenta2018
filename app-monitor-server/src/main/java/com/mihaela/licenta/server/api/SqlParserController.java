package com.mihaela.licenta.server.api;

import com.mihaela.licenta.server.dto.SqlParserDTO;
import com.mihaela.licenta.server.dto.SqlParserESDto;
import com.mihaela.licenta.server.elasticsearch.ElasticSearchClient;
import com.mihaela.licenta.server.util.SQLQueryTypeEnum;
import net.sf.jsqlparser.JSQLParserException;
import net.sf.jsqlparser.parser.CCJSqlParserManager;
import net.sf.jsqlparser.parser.CCJSqlParserUtil;
import net.sf.jsqlparser.parser.JSqlParser;
import net.sf.jsqlparser.statement.Statement;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.io.Reader;
import java.io.StringReader;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.Date;

@RestController
@RequestMapping("/agent")
public class SqlParserController {

    private static final Logger LOGGER = LoggerFactory.getLogger( SqlParserController.class.getName() );

    @Autowired
    ElasticSearchClient elasticSearchClient;

    @Autowired
    private SimpMessagingTemplate template;

    @PostMapping(produces = {MediaType.APPLICATION_JSON_VALUE})
    public SqlParserESDto receiveDataFromAgent(@RequestBody @Valid SqlParserDTO input) throws JSQLParserException {

        JSqlParser parser = new CCJSqlParserManager();
        Reader targetReader = new StringReader(input.getSql());
        Statement statement = null;
        try {
            statement = parser.parse(targetReader);
        } catch (JSQLParserException e) {
            e.printStackTrace();
        }

        System.out.println("Received post: " + input.getSql());
        LOGGER.info("Received post {}", input);

        statement = CCJSqlParserUtil.parse(input.getSql());

        SqlParserESDto dto = constructObjectForElasticSearch(input, statement);

        elasticSearchClient.writeDTOtoES(dto);
        dto.setStatement(null);
        if (!dto.getQuery().matches("COMMIT")) {
            template.convertAndSend("/chat", dto);
        }
        return dto;
    }

    private SqlParserESDto constructObjectForElasticSearch(SqlParserDTO input, Statement statement) {
        SqlParserESDto dto = new SqlParserESDto();
        dto.setStatement(statement);
        dto.setSqlQueryTypeEnum(SQLQueryTypeEnum.valueOf(statement.getClass().getSimpleName().toUpperCase()));
        dto.setQuery(input.getSql());
        dto.setQueryResponseTime(input.getTime());
        dto.setTimestamp(new Date());
        dto.setTimestampString(dto.getTimestamp().toInstant().toString());
        dto.setApplicationId(input.getApplicationId());

        String hashedQuery = hashQuery(dto);
        dto.setHashedQuery(hashedQuery);
        return dto;
    }

    private String hashQuery(SqlParserESDto dto) {
        MessageDigest messageDigest = null;
        try {
            messageDigest = MessageDigest.getInstance("SHA-256");
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
        messageDigest.update(dto.getQuery().getBytes());

        return new String(Base64.getEncoder().encode(messageDigest.digest()));
    }
}
