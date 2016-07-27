const token = require("../lib/token");

describe("token", function () {

  context("string input", function () {
    context("contains valid token", function () {
      it("returns token as string", function () {
        expect(token("a9d0ed10e9cfd022a61cb08753f49c5a0b0dfb784697bf9f9d750a1003da19c7"))
          .to.equal("a9d0ed10e9cfd022a61cb08753f49c5a0b0dfb784697bf9f9d750a1003da19c7");
      });

      it("strips invalid characters", function () {
        expect(token("<a9d0ed1 0e9cfd 022a61 cb0875 3f49c5 a0b0d fb784697bf9f9d750a1003da19c7>"))
          .to.equal("a9d0ed10e9cfd022a61cb08753f49c5a0b0dfb784697bf9f9d750a1003da19c7");
      });

      it("supports uppercase input", function () {
        expect(token("a9d0ed10e9cfd022a61cb08753f49c5a0b0dfb784697bf9f9d750a1003da19c7"))
          .to.equal("a9d0ed10e9cfd022a61cb08753f49c5a0b0dfb784697bf9f9d750a1003da19c7");
      });
    });

    it("throws when input is empty", function () {
      expect(function () { token(""); }).to.throw(/invalid length/);
    });

    it("throws when input is too short", function () {
      expect(function () { token("a9d0ed10e9cfd022a61cb08753f49c5a0b0dfb784697bf9f9d750a1003da19c") }).to.throw(/invalid length/);
    });

    it("throws when input is too long", function () {
      expect(function () { token("a9d0ed10e9cfd022a61cb08753f49c5a0b0dfb784697bf9f9d750a1003da19c788") }).to.throw(/invalid length/);
    });
  });

  context("Buffer input", function() {
    context("contains valid token", function () {
      it("returns token as string", function () {
        expect(token(new Buffer("a9d0ed10e9cfd022a61cb08753f49c5a0b0dfb784697bf9f9d750a1003da19c7", "hex")))
          .to.equal("a9d0ed10e9cfd022a61cb08753f49c5a0b0dfb784697bf9f9d750a1003da19c7");
      });
    });

    it("throws when input is empty", function () {
      expect(function () { token(new Buffer([])); }).to.throw(/invalid length/);
    });

    it("throws when input is too short", function () {
      const input = new Buffer("a9d0ed10e9cfd022a61cb08753f49c5a0b0dfb784697bf9f9d750a1003da19", "hex")
      expect(function () { token(input) }).to.throw(/invalid length/);
    });

    it("throws when input is too long", function () {
      const input = new Buffer("a9d0ed10e9cfd022a61cb08753f49c5a0b0dfb784697bf9f9d750a1003da19c788", "hex")
      expect(function () { token(input) }).to.throw(/invalid length/);
    });
  });
});