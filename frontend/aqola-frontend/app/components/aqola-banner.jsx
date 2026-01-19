const test = () => {
    console.log("hi");
};

export default function Banner(){

    return(
        <div className="flex items-center justify-center bg-gray-800">
            {/* <button onClick={test} className="text-4xl text-cyan-400 m-10 font-sans bg-cyan-900 p-3 border rounded-2xl hover:bg-cyan-950">Docs</button> */}
            <img src="/koala-no-bckgr.png" className="h-50 m-0 p-0" />
            <button onClick={test} className="text-4xl text-cyan-400 m-10 font-sans bg-cyan-900 p-3 border rounded-2xl hover:bg-cyan-950">Docs</button>
        </div>
    );
}

