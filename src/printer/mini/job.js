// This file is part of the Prusa Connect Local
// Copyright (C) 2021 Prusa Research a.s. - www.prusa3d.com
// SPDX-License-Identifier: GPL-3.0-or-later

import { getJson } from "../../auth";
import { updateProperties } from "../components/updateProperties.js";
import { handleError } from "../components/errors.js";
import { translate } from "../../locale_provider";

const update = (data) => {
  if (data.state != states.PRINTING) {
    to_page(data.state);
  } else {
    load();
  }
};

export const load = () => {
  translate("proj.title", { query: "#title-status-label" });
  getJson("/api/job")
    .then((result) => {
      const data = result.data;
      const completion = data.progress.completion;
      if (completion) {
        document.querySelector("progress").value = completion;
      }
      updateProperties("job", data);
    })
    .catch((result) => handleError(result));
};

export default { load, update };
