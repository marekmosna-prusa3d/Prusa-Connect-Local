// This file is part of the Prusa Connect Local
// Copyright (C) 2021 Prusa Research a.s. - www.prusa3d.com
// SPDX-License-Identifier: GPL-3.0-or-later

import * as graph from "../components/temperature_graph";
import { load as job } from "./job.js";
import { translate } from "../../locale_provider";
import { updateProperties } from "../components/updateProperties.js";


const idleTitle = () => {
  document.getElementById("title-status").innerText = translate("prop.st-idle");
};

const printingTitle = () => {
  document.getElementById("title-status").innerText = translate(
    "prop.st-printing"
  );
};

const load = () => {
  updateProperties("job", {});
  document.getElementById(
    "title-status-label"
  ).innerHTML = `<p class="txt-grey" >${translate(
    "home.title"
  )}:<span id="title-status" class="txt-orange">Idle</span></p>`;
  idleTitle();
  document.getElementById("temps-title").innerText = translate(
    "temps.title"
  ).toLowerCase();
  graph.render();
};

const update = (context) => {
  if (
    context &&
    context.printer.state.flags.printing &&
    !context.printer.state.flags.ready
  ) {
    job();
    printingTitle();
  } else {
    load();
  }
};

export default { load, update };
