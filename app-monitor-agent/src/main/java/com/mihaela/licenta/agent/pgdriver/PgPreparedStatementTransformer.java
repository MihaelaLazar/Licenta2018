package com.mihaela.licenta.agent.pgdriver;

import com.mihaela.licenta.agent.AbstractClassTransformer;
import com.mihaela.licenta.agent.MethodDefinition;
import com.mihaela.licenta.agent.MethodTransformer;
import javassist.*;

import java.util.Collections;

public class PgPreparedStatementTransformer extends AbstractClassTransformer {
    public PgPreparedStatementTransformer() {
        getMethodTransformers().put(new MethodDefinition("execute", Collections.<String>emptyList()),
                new PgPreparedStatementTransformer.FromVariableMethodTransformer());
        getMethodTransformers().put(new MethodDefinition("executeQuery", Collections.<String>emptyList()),
                new PgPreparedStatementTransformer.FromVariableMethodTransformer());
        getMethodTransformers().put(new MethodDefinition("executeUpdate", Collections.<String>emptyList()),
                new PgPreparedStatementTransformer.FromVariableMethodTransformer());
    }

    private static class FromVariableMethodTransformer implements MethodTransformer {

        @Override
        public void transform(CtMethod m, String appId) throws CannotCompileException, NotFoundException {

            System.out.println("-----------test");
            m.addLocalVariable("elapsedTime", CtClass.longType);
            m.addLocalVariable("timestamp", CtClass.longType);
            m.addLocalVariable("sql", ClassPool.getDefault().get("java.lang.String"));
            m.addLocalVariable("appId", ClassPool.getDefault().get("java.lang.String"));
            m.insertBefore("elapsedTime = System.currentTimeMillis();timestamp = System.currentTimeMillis();sql=preparedQuery.key; appId = \"" + appId + "\";");
            m.insertAfter("{elapsedTime = System.currentTimeMillis() - elapsedTime;"
                    + "System.out.println(\"TESTESTESTET\"+preparedQuery);"
                    + "com.mihaela.licenta.agent.DbAppMonitorUpdater.update(sql, timestamp, elapsedTime, appId);}");
        }
    }
}
