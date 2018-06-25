package com.mihaela.licenta.server.dto;

import javax.validation.constraints.NotNull;

public class SqlParserDTO {

    @NotNull
    private String sql;

    @NotNull
    private  Long time;

    @NotNull
    private Long timestamp;

    @NotNull
    private String applicationId;

    public Long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Long timestamp) {
        this.timestamp = timestamp;
    }

    public String getSql() {
        return sql;
    }

    public void setSql(String sql) {
        this.sql = sql;
    }

    public Long getTime() {
        return time;
    }

    public void setTime(Long time) {
        this.time = time;
    }

    public String getApplicationId() {
        return applicationId;
    }

    public void setApplicationId(String applicationId) {
        this.applicationId = applicationId;
    }
}
