import React from "react";

import ColDetails from "../Pie";
import TableDetails from "../Table";

const StatisticsPage = () => {
  return (
    <div className="statisticspage" id="statisticspage">
      <ColDetails />
      <TableDetails />
    </div>
  );
};

export default StatisticsPage;
