import * as target from "./GetLatestDeployment";
import type {Deployment} from "./types/Deployment";
import type {AxiosRequestConfig, AxiosResponse} from "axios";
import {mockFunction} from "../testing/JestHelpers";
import axios from "axios";
import {apiToken} from "./providers/Environment";

jest.mock("axios");
jest.mock("@src/render-dot-com/providers/Environment");

const axiosGetMock = mockFunction(axios.get);
const apiTokenMock = mockFunction(apiToken);

const serviceId = "test-123";

const expectedDeployment = buildDeploymentStub("123");
const expectedUrl = `https://api.render.com/v1/services/${serviceId}/deploys?limit=1`;
const expectedAxiosConfig: AxiosRequestConfig = {
  headers: {
    accept: "application/json",
    authorization: "Bearer test-api-token"
  }
};

let result: Awaited<ReturnType<typeof target.getLatestDeployment>>;
let caughtError: unknown;

beforeEach(() => {
  axiosGetMock.mockResolvedValue(<AxiosResponse<Deployment[]>>{
    status: 200,
    data: [
      expectedDeployment
    ]
  });
  apiTokenMock.mockReturnValue("test-api-token");
});

describe("given a single deployment is returned", () => {
  beforeEach(async () => {
    result = await target.getLatestDeployment(serviceId);
  });

  it("should return latest deployment successfully", () => {
    expect(result).toEqual(expectedDeployment);
  });

  it("should configuration axios correctly", () => {
    expect(axiosGetMock).toHaveBeenCalledWith(expectedUrl, expectedAxiosConfig);
  });
});

describe("given three deployments are returned", () => {
  beforeEach(async () => {
    axiosGetMock.mockResolvedValue(<AxiosResponse<Deployment[]>>{
      status: 200,
      data: [
        expectedDeployment,
        buildDeploymentStub("other1"),
        buildDeploymentStub("other2")
      ]
    });

    result = await target.getLatestDeployment(serviceId);
  });

  it("should return latest deployment successfully", () => {
    expect(result).toEqual(expectedDeployment);
  });

  it("should configuration axios correctly", () => {
    expect(axiosGetMock).toHaveBeenCalledWith(expectedUrl, expectedAxiosConfig);
  });
});

describe("given no deployments deployments are returned", () => {
  beforeEach(async () => {
    axiosGetMock.mockResolvedValue(<AxiosResponse<Deployment[]>>{
      status: 200,
      data: [] as Deployment[]
    });

    try {
      await target.getLatestDeployment(serviceId);
    } catch (error) {
      caughtError = error;
    }
  });

  it("should throw error", () => {
    expect(caughtError).toEqual(new Error("Could not find any deployments"));
  });

  it("should configuration axios correctly", () => {
    expect(axiosGetMock).toHaveBeenCalledWith(expectedUrl, expectedAxiosConfig);
  });
});

describe("given http response isn't 200", () => {
  beforeEach(async () => {
    axiosGetMock.mockResolvedValue(<AxiosResponse<Deployment[]>>{
      status: 505,
      data: [
        expectedDeployment
      ]
    });

    try {
      await target.getLatestDeployment(serviceId);
    } catch (error) {
      caughtError = error;
    }
  });

  it("should throw error", () => {
    expect(caughtError).toEqual(new Error("Failed to get deployments"));
  });

  it("should configuration axios correctly", () => {
    expect(axiosGetMock).toHaveBeenCalledWith(expectedUrl, expectedAxiosConfig);
  });
});

function buildDeploymentStub(id: string): Deployment {
  return {id} as unknown as Deployment;
}