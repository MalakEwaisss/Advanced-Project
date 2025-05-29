package project.demo.aspect;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.*;
import org.aspectj.lang.ProceedingJoinPoint;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class AuthAspect {

    //  Pointcuts for login and signup methods
    @Pointcut("execution(* project.demo.controllers.AuthController.login(..))")
    public void loginPointcut() {}

    @Pointcut("execution(* project.demo.controllers.AuthController.signup(..))")
    public void signupPointcut() {}

    //  Before login
    @Before("loginPointcut()")
    public void beforeLogin(JoinPoint joinPoint) {
        System.out.println("Before login: " + joinPoint.getSignature());
    }

    //  After login
    @After("loginPointcut()")
    public void afterLogin(JoinPoint joinPoint) {
        System.out.println(" After login: " + joinPoint.getSignature());
    }

    //  After login returns successfully
    @AfterReturning(pointcut = "loginPointcut()", returning = "result")
    public void afterLoginReturning(JoinPoint joinPoint, Object result) {
        System.out.println(" Login returned: " + result);
    }

    //  After login throws exception
    @AfterThrowing(pointcut = "loginPointcut()", throwing = "ex")
    public void afterLoginException(JoinPoint joinPoint, Exception ex) {
        System.out.println(" Exception in login: " + ex.getMessage());
    }

    //  Around login to measure time
    @Around("loginPointcut()")
    public Object aroundLogin(ProceedingJoinPoint joinPoint) throws Throwable {
        long start = System.currentTimeMillis();
        Object result = joinPoint.proceed(); // proceed with method
        long time = System.currentTimeMillis() - start;
        System.out.println(" Login took: " + time + "ms");
        return result;
    }

    // Repeat the same logic for signup:

    @Before("signupPointcut()")
    public void beforeSignup(JoinPoint joinPoint) {
        System.out.println(" Before signup: " + joinPoint.getSignature());
    }

    @After("signupPointcut()")
    public void afterSignup(JoinPoint joinPoint) {
        System.out.println(" After signup: " + joinPoint.getSignature());
    }

    @AfterReturning(pointcut = "signupPointcut()", returning = "result")
    public void afterSignupReturning(JoinPoint joinPoint, Object result) {
        System.out.println(" Signup returned: " + result);
    }

    @AfterThrowing(pointcut = "signupPointcut()", throwing = "ex")
    public void afterSignupException(JoinPoint joinPoint, Exception ex) {
        System.out.println(" Exception in signup: " + ex.getMessage());
    }

    @Around("signupPointcut()")
    public Object aroundSignup(ProceedingJoinPoint joinPoint) throws Throwable {
        long start = System.currentTimeMillis();
        Object result = joinPoint.proceed();
        long time = System.currentTimeMillis() - start;
        System.out.println(" Signup took: " + time + "ms");
        return result;
    }
}
