import axios from "axios";
import type {Deployment} from "@src/render-dot-com/types/Deployment";
import {apiToken} from "@src/render-dot-com/providers/Environment";

export async function getLatestDeployment(serviceId: string): Promise<Deployment> {
  const response = await axios.get<Deployment[]>(`https://api.render.com/v1/services/${serviceId}/deploys?limit=1`, {
    headers: {
      accept: "application/json",
      authorization: `Bearer ${apiToken()}`
    }
  });

  if (response.status !== 200) {
    throw new Error("Failed to get deployments");
  }

  const deployments = response.data;
  if (deployments.length === 0) {
    throw new Error("Could not find any deployments");
  }

  return deployments[0];
}