import cron from "node-cron";
import { spawn } from "child_process";
import { run } from "@/scripts/seed";

function runPython(cmd: string, args: string[],option: Object) {
  return new Promise<number>((resolve) => {
    const py = spawn(cmd, args, option);

    py.on("close", (code) => {
      resolve(code ?? 0);
    });
  });
}

async function runChecks() {
  let update_or_not = 0;

  const code1 = await runPython("python", ["../data/sp_opp_data_updater.py"], {cwd:"data"});
  const code2 = await runPython("python", ["../data/documents_forms_data_updater.py"], {cwd:"data"});

  if (code1 === 10 || code2 === 10) {
    update_or_not = 1;
  }

  if (update_or_not > 0) {
    console.log("run method from Seed.ts is being called...");
    await run();
    
  } else {
    console.log("Seed.ts is not called...");
  }
}

console.log("Scheduler started...");

// Runs once a day at 12:30 server time to check whether the files are up-to-date
cron.schedule("30 12 * * *", () => {
  console.log("Running daily check...");
  runChecks();
});