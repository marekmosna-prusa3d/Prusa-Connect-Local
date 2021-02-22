// This file is part of the Prusa Connect Local
// Copyright (C) 2021 Prusa Research a.s. - www.prusa3d.com
// SPDX-License-Identifier: GPL-3.0-or-later

const Printer = require("./printer.js");

class PrinterSL1 extends Printer {
  constructor() {
    super(require("./files_sl1"), "Original Prusa SL1", 100);
  }

  systemCommands(url) {
    const commands = super.systemCommands(url);
    commands["custom"] = [
      {
        action: "resinrefill", // after sending this command, printer should change its state to "busy" (PCL will show "wait until layer finishes"). After printer is ready to refill, state should change to "paused"
        name: "ResinRefill",
        confirm: "Are you sure?",
        source: "custom",
        resource: url + "/custom/resinrefill",
      },
      {
        action: "resinrefilled", // after sending this command, printer should update the resin volume in tank. PCL will then send /api/job with command: pause, action: resume
        name: "ResinRefilled",
        source: "custom",
        resource: url + "/custom/resinrefilled",
      },
    ];
    return commands;
  }

  job() {
    const jobSL1 = super.job();
    const layers = 200;
    const resin = 100;

    if (this.status.printing) {
      jobSL1.job.file = {
        ...jobSL1.job.file,
        layers: layers,
        layerHeight: 0.05,
        exposureTime: 1500,
        exposureTimeFirst: 15000,
        exposureTimeCalibration: 3000,
      };
      if (this.isPrinting) {
        const completion = jobSL1.progress.completion;
        jobSL1["resin"] = {
          remaining: (1 - completion) * resin,
          consumed: completion * resin,
        };
        jobSL1.progress["currentLayer"] = parseInt(completion * layers);
      }
    }

    return jobSL1;
  }

  onUpdate() {
    const printerStatus = super.onUpdate();
    const temperatures = printerStatus.temperature;

    printerStatus["telemetry"] = {
      tempCpu: temperatures.bed.actual,
      tempUvLed: this.isPrinting ? temperatures.tool0.actual : 0,
      tempAmbient: temperatures.chamber.actual,
      fanUvLed: this.isPrinting ? Math.random() * 1000 : 0,
      fanBlower: this.isPrinting ? Math.random() * 1000 : 0,
      fanRear: this.isPrinting ? Math.random() * 1000 : 0,
      coverClosed: false,
    };

    return printerStatus;
  }
}

module.exports = PrinterSL1;
