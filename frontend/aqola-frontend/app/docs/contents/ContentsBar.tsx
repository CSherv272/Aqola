"use client";
import { useEffect, useState } from "react";

const ContentsBar = () => {
    const [h1List, setH1List] = useState<HTMLElement[]>([]);
    useEffect(() => {
        const h1Elements = document.querySelectorAll("h2");
        setH1List(Array.from(h1Elements).filter((h1) => !h1.textContent?.includes("Contents")));
    }, []);

    return (
        <div className="contents-bar">
            <div className="contents-heading">
                <h2>Contents</h2>
            </div>
            <div className="contents-list">
                <ul id="contents-list">
                    {Array.from(h1List).map((h1, index) => (
                        <li key={index}>
                            <a href={`#${h1.id}`}>{h1.textContent}</a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ContentsBar;
