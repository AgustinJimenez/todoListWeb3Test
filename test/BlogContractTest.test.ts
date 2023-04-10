import { expect } from "chai";
import { ethers } from "hardhat";

const getBlogContract = async () => {
  const blogContractFactory = await ethers.getContractFactory("Blog");
  const blogContract = await blogContractFactory.deploy();
  await blogContract.deployed();
  return blogContract;
};

describe("Blog", function () {
  it("Should create a post", async () => {
    const blogContract = await getBlogContract();
    await blogContract.createPost("My first post", "12345");

    const posts = await blogContract.fetchPosts();
    expect(posts[0].title).to.equal("My first post");
  });

  it("Should edit a post", async () => {
    const blogContract = await getBlogContract();
    await blogContract.createPost("My first post", "12345");

    await blogContract.updatePost(1, "My updated post", "23456", true);

    const posts = await blogContract.fetchPosts();
    expect(posts[0].title).to.equal("My updated post");
  });

  it("Should update a post name", async () => {
    const blogContract = await getBlogContract();
    expect(await blogContract.name()).to.equal("My personal blog");
    await blogContract.updateName("My updated personal post");
    expect(await blogContract.name()).to.equal("My updated personal post");
  });
});
