package com.mihaela.licenta.agent.pgdriver;

import com.mihaela.licenta.agent.AbstractClassTransformer;
import com.mihaela.licenta.agent.MethodDefinition;
import com.mihaela.licenta.agent.MethodTransformer;
import javassist.*;

import java.util.Arrays;

public class QueryExecutorImplTransformer extends AbstractClassTransformer {
    public QueryExecutorImplTransformer() {
        getMethodTransformers().put(new MethodDefinition("execute", Arrays.asList("org.postgresql.core.Query", "org.postgresql.core.ParameterList", "org.postgresql.core.ResultHandler", "int", "int", "int")), new QueryExecutorImplTransformer.SimpleMethodTransformer());
    }

    private static class SimpleMethodTransformer implements MethodTransformer {

        @Override
        public void transform(CtMethod m, String appId) throws CannotCompileException, NotFoundException {
            m.addLocalVariable("elapsedTime", CtClass.longType);
            m.addLocalVariable("timestamp", CtClass.longType);
            m.addLocalVariable("sql", ClassPool.getDefault().get("java.lang.String"));
            m.addLocalVariable("appId", ClassPool.getDefault().get("java.lang.String"));
            m.insertBefore("elapsedTime = System.currentTimeMillis();timestamp = System.currentTimeMillis();sql=$1.getNativeSql(); appId = \"" + appId + "\";");
            m.insertAfter("{elapsedTime = System.currentTimeMillis() - elapsedTime;"
                    + "com.mihaela.licenta.agent.DbAppMonitorUpdater.update(sql, timestamp, elapsedTime, appId);}");
        }
    }
}
