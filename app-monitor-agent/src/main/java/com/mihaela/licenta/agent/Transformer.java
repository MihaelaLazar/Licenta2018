package com.mihaela.licenta.agent;

import javassist.ClassPool;
import javassist.CtClass;
import javassist.CtMethod;
import javassist.NotFoundException;

import java.lang.instrument.ClassFileTransformer;
import java.lang.instrument.IllegalClassFormatException;
import java.lang.reflect.Modifier;
import java.security.ProtectionDomain;
import java.util.Map;

public class Transformer implements ClassFileTransformer {

    private Map<String, ClassTransformer> classTransformerMap;

    private String appId;

    public Transformer(Map<String, ClassTransformer> classTransformerMap, String appId) {
        this.classTransformerMap = classTransformerMap;
        this.appId = appId;
    }

    public byte[] transform(ClassLoader loader, String className,
                            Class<?> classBeingRedefined, ProtectionDomain protectionDomain,
                            byte[] classfileBuffer) throws IllegalClassFormatException {

        byte[] byteCode = classfileBuffer;

        String simpleClassName = className.replace("/", ".");
        if (classTransformerMap.keySet().contains(simpleClassName)) {
            try {

                CtClass cc = ClassPool.getDefault().get(simpleClassName);
                System.out.println(simpleClassName);

                if (cc.isInterface() && classTransformerMap.get(simpleClassName) != null) {
                    System.out.println("Found ClassTransformer for " + simpleClassName + ", but class is an interface. Skipping it.");
                    return byteCode;
                }

                System.out.println("-------------------------------");
                System.out.println("Instrumenting " + cc.getName());
                System.out.println("-------------------------------");

                Map<MethodDefinition, MethodTransformer> methodTransformerMap = classTransformerMap.get(simpleClassName).getMethodTransformers();


                for (Map.Entry<MethodDefinition, MethodTransformer> entry : methodTransformerMap.entrySet()) {
                    CtMethod m;

                    try {
                        if (entry.getKey().getParameterTypes().isEmpty()) {
                            m = cc.getDeclaredMethod(entry.getKey().getName());
                        } else {
                            CtClass[] params = new CtClass[entry.getKey().getParameterTypes().size()];
                            for (int i = 0; i < entry.getKey().getParameterTypes().size(); i++) {
                                params[i] = ClassPool.getDefault().get(entry.getKey().getParameterTypes().get(i));
                            }
                            m = cc.getDeclaredMethod(entry.getKey().getName(), params);
                        }
                    } catch (NotFoundException ex) {
                        System.out.println("Trying to transform " + entry.getKey() + " but couldn't find it. Skipping it.");
                        continue;
                    }

                    if ((m.getModifiers() & Modifier.ABSTRACT) == Modifier.ABSTRACT) {
                        System.out.println("Trying to transform " + entry.getKey() + " but it is abstract. Skipping it.");
                        continue;
                    }

                    System.out.println("              ." + m.getMethodInfo().getName());

                    entry.getValue().transform(m, appId);



                }
                byteCode = cc.toBytecode();
                cc.detach();

            } catch (Exception ex) {
                ex.printStackTrace();
            }
        }

        return byteCode;
    }
}
