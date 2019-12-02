export function throws(t, throwingFunction, errorType){
    try{
        throwingFunction();
        t.fail("This shall never execute")
    }
    catch (e) {
        t.equal(e.name, errorType.name, "Correct error type");
    }
}