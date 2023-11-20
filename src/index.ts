#! /usr/bin/env node
import { Command } from "commander";
import { exec } from "child_process";

function killProcessOnPort(port: number | string) {
  exec(
    `lsof -i :${port} | grep LISTEN | awk '{print $2}'`,
    (err, stdout, stderr) => {
      if (err) {
        console.error(`[CTOOLKIT] exec error: ${err}`);
        return;
      }

      const processId = stdout.trim();
      if (processId) {
        exec(`kill -9 ${processId}`, (err, stdout, stderr) => {
          if (err) {
            console.error(`[CTOOLKIT] exec error: ${err}`);
            return;
          }
          console.log(`[CTOOLKIT] Process on port ${port} has been killed.`);
        });
      } else {
        console.log(`[CTOOLKIT] No process listening on port ${port}`);
      }
    }
  );
}

const program = new Command();

program
  .command("kill")
  .description("Kill process on port")
  .option("--port <port>", "Port to kill")
  .action((options) => {
    if (options.port) {
      killProcessOnPort(options.port);
    }
  });

program.parse();
