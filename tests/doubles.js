/**
 * Test Double: Stub
 * Menyediakan nilai input kupon tanpa membutuhkan halaman browser sungguhan.
 */
function createInputStub(value) {
    return {
        value,
        id: 'coupon-code-input'
    };
}

/**
 * Test Double: Spy
 * Mencatat pemanggilan fungsi dan argumen yang diterima.
 */
function createSpy(implementation = () => undefined) {
    const spy = (...args) => {
        spy.calls.push(args);
        return implementation(...args);
    };

    spy.calls = [];
    return spy;
}

module.exports = {
    createInputStub,
    createSpy
};
