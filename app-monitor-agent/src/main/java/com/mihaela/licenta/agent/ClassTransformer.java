package com.mihaela.licenta.agent;

import java.util.Map;

public interface ClassTransformer {
    Map<MethodDefinition, MethodTransformer> getMethodTransformers();
}
