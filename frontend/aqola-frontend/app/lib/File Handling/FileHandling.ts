import { useAppStore } from "@/app/store/AppStore"
import { get } from "lodash";
import { use } from "react";

const getAllCharts = useAppStore((state) => state.getAllCharts);
const charts = getAllCharts();
const stateExport = () => {

}