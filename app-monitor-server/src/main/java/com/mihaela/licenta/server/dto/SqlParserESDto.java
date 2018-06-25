package com.mihaela.licenta.server.dto;

import com.mihaela.licenta.server.util.SQLQueryTypeEnum;
import net.sf.jsqlparser.statement.Statement;

import java.util.Date;

public class SqlParserESDto {
    private Statement statement;

    private SQLQueryTypeEnum sqlQueryTypeEnum;

    private String query;

    private @javax.validation.constraints.NotNull Long queryResponseTime;

    private Date timestamp;

    private String timestampString;

    private String applicationId;

    public String getHashedQuery() {
        return hashedQuery;
    }

    public void setHashedQuery(String hashedQuery) {
        this.hashedQuery = hashedQuery;
    }

    private String hashedQuery;

    public String getApplicationId() {
        return applicationId;
    }

    public void setApplicationId(String applicationId) {
        this.applicationId = applicationId;
    }

    public String getTimestampString() {
        return timestampString;
    }

    public void setTimestampString(String timestampString) {
        this.timestampString = timestampString;
    }

    public Date getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Date timestamp) {
        this.timestamp = timestamp;
    }

    public String getQuery() {
        return query;
    }

    public void setQuery(String query) {
        this.query = query;
    }

    public @javax.validation.constraints.NotNull Long getQueryResponseTime() {
        return queryResponseTime;
    }

    public void setQueryResponseTime(@javax.validation.constraints.NotNull Long queryResponseTime) {
        this.queryResponseTime = queryResponseTime;
    }

    public Statement getStatement() {
        return statement;
    }

    public void setStatement(Statement statement) {
        this.statement = statement;
    }

    public SQLQueryTypeEnum getSQLQueryType() {
        return sqlQueryTypeEnum;
    }

    public void setSqlQueryTypeEnum(SQLQueryTypeEnum type) {
        this.sqlQueryTypeEnum = type;
    }
}
