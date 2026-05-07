import { useAppStore } from "@/app/store/AppStore"
    
const stateExport = () => {
    const minimisedCharts = useAppStore.getState().minimisedCharts;
    const openCharts = useAppStore.getState().openCharts;

    if([...openCharts, ...minimisedCharts].length > 0) {
    const dataStr = "data:text/json;charset=utf-8," + 
        encodeURIComponent(
            JSON.stringify({
                opened: openCharts,
                minimised: minimisedCharts
            })
        );

        const a = document.createElement("a");
        a.href = dataStr;
        a.download = "chart_state.json";
        a.click();
    }
}

const stateImport = (e: any) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = (evt) => {
            try{
                const addOpenCharts = useAppStore.getState().addOpenCharts;
                const addMinimisedCharts = useAppStore.getState().addMinimisedCharts;
                if (evt.target?.result) {
                    const data = JSON.parse(evt.target?.result as string);
                    addOpenCharts(data.opened);
                    addMinimisedCharts(data.minimised);
                }
            } catch (error) {
               console.error("Error reading file:", error);
               console.error("Please ensure the file is in the correct format and try again.");
            }
        };  
    }
}

export { stateExport, stateImport };