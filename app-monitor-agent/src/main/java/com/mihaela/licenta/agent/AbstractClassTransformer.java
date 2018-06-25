package com.mihaela.licenta.agent;

import java.util.HashMap;
import java.util.Map;

public abstract class AbstractClassTransformer implements ClassTransformer {

    private Map<MethodDefinition, MethodTransformer> methodTransformers = new HashMap<MethodDefinition, MethodTransformer>();

    public Map<MethodDefinition, MethodTransformer> getMethodTransformers(){
        return methodTransformers;
    }
}
