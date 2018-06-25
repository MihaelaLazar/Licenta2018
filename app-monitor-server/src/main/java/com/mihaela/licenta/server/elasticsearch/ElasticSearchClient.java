package com.mihaela.licenta.server.elasticsearch;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mihaela.licenta.server.dto.SqlParserESDto;
import org.apache.http.HttpHost;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.action.index.IndexResponse;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.common.xcontent.XContentType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.io.IOException;


@Component
public class ElasticSearchClient {

    private static final Logger LOGGER = LoggerFactory.getLogger(ElasticSearchClient.class.getName());

    private RestHighLevelClient client;

    public ElasticSearchClient() {
        client = new RestHighLevelClient(
                RestClient.builder(
                        new HttpHost("localhost", 9200, "http"),
                        new HttpHost("localhost", 9201, "http")));
    }

    public void writeDTOtoES(SqlParserESDto dto) {
        ObjectMapper mapper = new ObjectMapper();
        String jsonInString = null;

        try {
            jsonInString = mapper.writeValueAsString(dto);
        } catch (JsonProcessingException e) {
            dto.setStatement(null);
            try {
                jsonInString = mapper.writeValueAsString(dto);
            } catch (JsonProcessingException e1) {
//                e1.printStackTrace();
            }

        }

        IndexRequest request;

        request = new IndexRequest(
                "queries2",
                "doc");
        if (jsonInString != null) {
            request.source(jsonInString, XContentType.JSON);
        }
        LOGGER.info("Writing to Elasticsearch: {}", jsonInString);
        try {
            IndexResponse indexResponse = client.index(request);
            String index = indexResponse.getIndex();
            String type = indexResponse.getType();
            String id = indexResponse.getId();
        } catch (IOException e) {
            e.printStackTrace();
        }

    }
}
