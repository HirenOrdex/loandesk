
import React from 'react';
import useriumg from '../assets/imgs/useriumg.png';
import pipeline from '../assets/imgs/pipeline.png';
import pluse from '../assets/imgs/pluse.png';
import findmatch from "../assets/imgs/find-a-match.png";
import interviewcalendar from "../assets/imgs/calendar-icon.png";
import matchpreference from "../assets/imgs/match-preference.png";
import crawler from "../assets/imgs/crawler.png"
import '../assets/css/Dashboard.css';  // For component-specific CSS


const Dashboard = () => {
    const cardData = [
        { title: 'New Deal', image: useriumg, extraImage: pluse },
        { title: 'Find A Match', image: findmatch },
        { title: 'Pipeline', image: pipeline },
        { title: 'Interview Calendar', image: interviewcalendar },
        { title: 'Match Preference', image: matchpreference },
        { title: 'Crawler', image: crawler },
    ];

    return (
        <>
            {/* Cards Section */}
            <div className="max-w-7xl mx-auto mt-10 px-4 sm:px-14 md:px-18 pb-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
                    {cardData.map((card, index) => (
                        <div key={index} className="w-full">
                            <div className="dashbordcard my-2">
                                <div className="p-3">
                                    <a>
                                        <h5 className="boxtitle">
                                            {card.title}
                                        </h5>
                                        <div className="flex justify-center py-10 my-6">
                                            <div className='pluseimgset'>
                                                <img src={card.image} alt={card.title} />
                                                {card.extraImage && (
                                                    <img
                                                        src={card.extraImage}
                                                        alt="plus icon"
                                                        className="absolute text-center top-[-20px] end-[-15px]" // replicates .plusesize
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Dashboard;