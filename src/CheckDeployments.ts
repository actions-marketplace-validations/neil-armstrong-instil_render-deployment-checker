import {waitFor} from "@src/utils/WaitFor";
import {getLatestDeployment} from "@src/render-dot-com/GetLatestDeployment";
import {deploymentName, serviceId} from "@src/github-actions/Configuration";
import {setFailed, info as logInfo, error as logError} from "@actions/core";

const fiveMinutes = 300000;
const intervalOfOneSecond = 1000;

async function checkDeployments(): Promise<void> {
  logInfo("Checking deployments to 'render.com'...");

  await waitForDeployment(deploymentName, serviceId);
}

async function waitForDeployment(deploymentName: string, webappServiceId: string): Promise<void> {
  logInfo(`Checking ${deploymentName} deployment...`);

  try {
    await waitFor(async () => {
      const latestDeployment = await getLatestDeployment(webappServiceId);
      if (latestDeployment.deploy.status !== "live") {
        logInfo("Checking...");
        throw new Error("Deployment still not live");
      }
    }, fiveMinutes, intervalOfOneSecond);
  } catch (error) {
    logError(`${deploymentName} deployment failed ❌ `);
    throw error;
  }

  logInfo(`${deploymentName} deployment successful ✅ `);
}

checkDeployments().catch(error => {
  logError(error);
  setFailed("Failed to check deployments");
  process.exit(1);
});
