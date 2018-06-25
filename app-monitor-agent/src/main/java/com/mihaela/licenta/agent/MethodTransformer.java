package com.mihaela.licenta.agent;

import javassist.CannotCompileException;
import javassist.CtMethod;
import javassist.NotFoundException;

public interface MethodTransformer {
    void transform(CtMethod m, String appId) throws CannotCompileException, NotFoundException;
}
