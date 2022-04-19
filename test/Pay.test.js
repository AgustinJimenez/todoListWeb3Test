const PayContract = artifacts.require("Pay");

contract("PayContract", (accounts) => {
  it("helloWorld should return 'Hello World'", async () => {
    const payContract = await PayContract.deployed();
    const result = await payContract.helloWorld();
    assert.equal(result, "Hello World", "helloWorld returns 'Hello World'");
  });
});
