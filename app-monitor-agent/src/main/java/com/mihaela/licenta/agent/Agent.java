package com.mihaela.licenta.agent;

import com.mihaela.licenta.agent.pgdriver.PgPreparedStatementTransformer;
import com.mihaela.licenta.agent.pgdriver.PgStatementTransformer;
import com.mihaela.licenta.agent.pgdriver.QueryExecutorImplTransformer;

import java.io.IOException;
import java.lang.instrument.Instrumentation;
import java.net.JarURLConnection;
import java.util.HashMap;
import java.util.Map;

public class Agent {

    private static String appId;

	static{
        Runtime.getRuntime().addShutdownHook(new Thread(){
            @Override
            public void run() {
                Agent.onExit();
            }
        });
	}
	
	public static void premain(String agentArgs, Instrumentation inst) throws IOException {
        JarURLConnection connection = (JarURLConnection)
                Agent.class.getResource("Agent.class").openConnection();
        inst.appendToBootstrapClassLoaderSearch(connection.getJarFile());

        processParams(agentArgs);

        Map<String, ClassTransformer> classTransformers = new HashMap<String, ClassTransformer>();
        classTransformers.put("org.postgresql.jdbc.PgStatement", new PgStatementTransformer());
        classTransformers.put("org.postgresql.jdbc.PgPreparedStatement", new PgPreparedStatementTransformer());
        classTransformers.put("org.postgresql.core.v3.QueryExecutorImpl", new QueryExecutorImplTransformer());


		inst.addTransformer(new Transformer(classTransformers, appId));
	}

	private static void processParams(String agentArgs) {
        if (agentArgs.startsWith("-appId=")){
            appId = agentArgs.split("=")[1];
        }
	}

    private static void onExit() {
        System.out.println("Java Monitor exited!");
    }

}