Function.prototype.ArrayFunction = function(param) {
    if (param instanceof Array) {
        return param.map( Function.prototype.ArrayFunction, this ) ;
    }
    else return (this)(param) ;
}
HandleOneElement.ArrayFunction(cubes) ;