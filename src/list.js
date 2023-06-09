const Router = require("./router.js");

module.exports = class List {

    // TODO: Review compiler estructures
    // TODO: iterator of values without "extend"
    // TODO: check repetitive sequences (times must be same)

    constructor (parent, expression, resolve = true) {
        this.parent = parent;
        this.padding = false;
        this.expression = expression;
        this.router = new Router(this, 'type', {defaultPrefix: '_extend'});
        this.values = this.extend();
        this.resolve = resolve;
    }
    extend() {
        return this._extend(this.expression);
    }
    _extendExpressionList(e) {
        let values = [];
        for(const value of e.values) {
            values = [...values, ...this._extend(value)];
        }
        return values;
    }
    _extend(e) {
        return this.router.go(e);
    }
    _extendAppend(e) {
        let values = [];
        const element = this._resolve(e);
        if (!element.dim && element.dim < 1) {
            throw new Error(`Could not extend and append a non array element`)
        }
        // TODO: non correct access from list class
        const count = element.lengths[0];
        let value = {...element}
        value.dim = value.dim - 1;
        value.lengths = value.lengths.slice(1);
        for(let index = 0; index < count; ++index) {
            // TODO: in proper way
            values.push({...value});
            ++value.value;
        }
        return values;
    }
    _extendExpr(e) {
        const num = this._resolve(e);
        return [num];
    }
    _resolve(e) {
        return this.resolve ? this.parent.resolveExpr(e.value) : e;
    }
    _resolveArray(e) {
        if (this.resolve) {
            return this.parent.resolveExpr(e.value);
        }
        return e;
    }
}
