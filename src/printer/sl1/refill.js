// This file is part of the Prusa Connect Local
// Copyright (C) 2021 Prusa Research a.s. - www.prusa3d.com
// SPDX-License-Identifier: GPL-3.0-or-later

import { getJson } from "../../auth";
import { handleError } from "../components/errors";
import { navigate } from "../../router.js";
import { update as jobUpdate } from "./job";

export const setUpRefill = () => {
  document.getElementById("refill").onclick = () => {
    navigate("#loading");
    getJson("/api/system/commands/custom/resinrefill", {
      method: "POST",
    })
      .then((result) => navigate("#refill"))
      .catch((result) => {
        navigate("#job");
        handleError(result);
      });
  };
};

const load = () => {
  const yesButton = document.getElementById("yes");
  const noButton = document.getElementById("no");
  yesButton.onclick = () => {
    yesButton.disabled = true;
    noButton.disabled = true;
    getJson("/api/system/commands/custom/resinrefilled", {
      method: "POST",
    })
      .catch((result) => handleError(result))
      .finally((result) => navigate("#job"));
  };
  noButton.onclick = () => {
    yesButton.disabled = true;
    noButton.disabled = true;
    getJson("/api/job", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ command: "pause", action: "resume" }),
    })
      .catch((result) => handleError(result))
      .finally((result) => navigate("#job"));
  };
};

export const update = (context) => {
  const flags = context.printer.state.flags;
  if (flags.paused) {
    for (let buttonId of ["yes", "no"]) {
      document.getElementById(buttonId).disabled = false;
    }
  } else if (!flags.pausing) {
    jobUpdate(context);
  }
};

export default { load, update };
