package com.mihaela.licenta.agent;

import java.util.ArrayList;
import java.util.List;

public class MethodDefinition {

    private String name;

    private List<String> parameterTypes = new ArrayList<String>();

    public MethodDefinition(String name, List<String> parameterTypes) {
        this.name = name;
        this.parameterTypes = parameterTypes;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<String> getParameterTypes() {
        return parameterTypes;
    }

    public void setParameterTypes(List<String> parameterTypes) {
        this.parameterTypes = parameterTypes;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof MethodDefinition)) return false;

        MethodDefinition that = (MethodDefinition) o;

        if (getName() != null ? !getName().equals(that.getName()) : that.getName() != null) return false;
        return getParameterTypes() != null ? getParameterTypes().equals(that.getParameterTypes()) : that.getParameterTypes() == null;
    }

    @Override
    public int hashCode() {
        int result = getName() != null ? getName().hashCode() : 0;
        result = 31 * result + (getParameterTypes() != null ? getParameterTypes().hashCode() : 0);
        return result;
    }

    @Override
    public String toString() {
        final StringBuffer sb = new StringBuffer("MethodDefinition{");
        sb.append("name='").append(name).append('\'');
        sb.append(", parameterTypes=").append(parameterTypes);
        sb.append('}');
        return sb.toString();
    }
}
