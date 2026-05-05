import { useAppStore } from "@/app/store/AppStore"
    
const stateExport = () => {
    console.log("Exporting state...")
    const getAllCharts = useAppStore.getState().getAllCharts;
    const charts = getAllCharts();

    if(charts.length > 0) {
        console.log("in the download function")
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(charts));
        const a = document.createElement("a");
        a.href = dataStr;
        a.download = "chart_state.json";
        a.click();
    }
}

const stateImport = () => {

}

export { stateExport, stateImport };