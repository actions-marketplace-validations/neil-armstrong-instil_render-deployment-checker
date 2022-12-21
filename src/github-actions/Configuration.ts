import {getInput} from "@actions/core";

export const serviceId = getInput("serviceId");
export const deploymentName = getInput("deploymentName");