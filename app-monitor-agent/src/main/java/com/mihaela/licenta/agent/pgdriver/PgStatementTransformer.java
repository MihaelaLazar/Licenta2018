package com.mihaela.licenta.agent.pgdriver;


import com.mihaela.licenta.agent.AbstractClassTransformer;
import com.mihaela.licenta.agent.MethodDefinition;
import com.mihaela.licenta.agent.MethodTransformer;
import javassist.*;

import java.util.Arrays;
import java.util.Collections;

public class PgStatementTransformer extends AbstractClassTransformer {


    public PgStatementTransformer() {
        getMethodTransformers().put(new MethodDefinition("execute", Collections.singletonList("java.lang.String")), new SimpleMethodTransformer());
        getMethodTransformers().put(new MethodDefinition("execute", Arrays.asList("java.lang.String", "int")), new SimpleMethodTransformer());
        getMethodTransformers().put(new MethodDefinition("execute", Arrays.asList("java.lang.String", "int[]")), new SimpleMethodTransformer());
        getMethodTransformers().put(new MethodDefinition("execute", Arrays.asList("java.lang.String", "java.lang.String[]")), new SimpleMethodTransformer());
//        getMethodTransformers().put(new MethodDefinition("executeBatch", Collections.<String>emptyList()), new SimpleMethodTransformer());
        getMethodTransformers().put(new MethodDefinition("executeQuery", Collections.singletonList("java.lang.String")), new SimpleMethodTransformer());
        getMethodTransformers().put(new MethodDefinition("executeUpdate", Collections.singletonList("java.lang.String")), new SimpleMethodTransformer());
        getMethodTransformers().put(new MethodDefinition("executeUpdate", Arrays.asList("java.lang.String", "int")), new SimpleMethodTransformer());
        getMethodTransformers().put(new MethodDefinition("executeUpdate", Arrays.asList("java.lang.String", "int[]")), new SimpleMethodTransformer());
        getMethodTransformers().put(new MethodDefinition("executeUpdate", Arrays.asList("java.lang.String", "java.lang.String[]")), new SimpleMethodTransformer());
    }

    private static class SimpleMethodTransformer implements MethodTransformer {

        @Override
        public void transform(CtMethod m, String appId) throws CannotCompileException, NotFoundException {
            m.addLocalVariable("elapsedTime", CtClass.longType);
            m.addLocalVariable("timestamp", CtClass.longType);
            m.addLocalVariable("sql", ClassPool.getDefault().get("java.lang.String"));
            m.addLocalVariable("appId", ClassPool.getDefault().get("java.lang.String"));
            m.insertBefore("elapsedTime = System.currentTimeMillis();timestamp = System.currentTimeMillis();sql=$1; appId = \"" + appId + "\";");
            m.insertAfter("{elapsedTime = System.currentTimeMillis() - elapsedTime;"
                    + "com.mihaela.licenta.agent.DbAppMonitorUpdater.update(sql, timestamp, elapsedTime, appId);}");
        }
    }
}
