export default function Banner({trigger} : {trigger: ()=> void}){
    
    const test = () => {
        console.log("hi");
    };

    return(
        <div className="flex items-center justify-center bg-gray-800">
            {/* <button onClick={test} className="text-4xl text-cyan-400 m-10 font-sans bg-cyan-900 p-3 border rounded-2xl hover:bg-cyan-950">Docs</button> */}
            <img src="/koala-no-bckgr.png" className="h-[200px] m-0 p-0" />
            <button onClick={trigger} className="text-4xl text-cyan-400 m-10 font-sans bg-cyan-900 p-3 border rounded-2xl hover:bg-cyan-950">Contact API</button>
        </div>
    );
}

