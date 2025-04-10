"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { useEffect, useState } from "react";

const CandidateHeatMap = ({ candidate, skills }) => {
    const [candidateSkills, setCandidateSkills] = useState([]);
    const heatMapColors = {
        0: "#ECFFF1",
        1: "#F8F8A7",
        2: "#A6D96A",
        3: "#1A9641",
        4: "#003F0B",
    };

    useEffect(() => {
        fetch(`https://forinterview.onrender.com/people/${candidate.id}`)
            .then((response) => response.json())
            .then((data) => {
                const candidateSkills = data.data.data.skillset.flatMap(
                    (category) =>
                        category.skills.map((skill) => ({
                            skill: skill.name,
                            consensus_score: skill.pos[0]?.consensus_score,
                        }))
                );
                setCandidateSkills(candidateSkills);
                console.log("Candidate Skills:", candidateSkills);
            })
            .catch((error) => {
                console.error("Error fetching candidate skills:", error);
            });
    }, [candidate]);

    return (
        <div className={styles.heatMapColumn}>
            {skills.map((skill) => (
                <div
                    key={skill}
                    className={styles.heatMapSkill}
                    style={{
                        backgroundColor:
                            heatMapColors[
                                candidateSkills.find((s) => s.skill === skill)
                                    ?.consensus_score
                            ] || "#ECFFF1",
                    }}
                ></div>
            ))}
        </div>
    );
};

export default function Home() {
    const [candidates, setCandidates] = useState([]);
    const [selectedCandidates, setSelectedCandidates] = useState([]);
    const [dropdownVisible, setDropdownVisible] = useState(false);

    const skills = [
        "Creating Wireframes",
        "Creating Basic Prototypes",
        "Creation of Brands",
        "Applying Color Theory",
        "Using Figma for Design",
        "Application fo Typography",
        "Creating Effective icons",
        "Optimizing Touch Points",
    ];

    const [filteredSkills, setFilteredSkills] = useState(skills);

    //write handleCandidateClick function. if candidate is already selected, remove it from selectedCandidates, else add it to selectedCandidates

    const handleCandidateClick = (candidate) => {
        const isSelected = selectedCandidates.some(
            (c) => c.id === candidate.id
        );
        if (isSelected) {
            setSelectedCandidates((prev) =>
                prev.filter((c) => c.id !== candidate.id)
            );
        } else {
            setSelectedCandidates((prev) => [...prev, candidate]);
        }
    };

    const toggleSkill = (skill) => {
        setFilteredSkills((prev) =>
            prev.includes(skill)
                ? prev.filter((s) => s !== skill)
                : [...prev, skill]
        );
    };

    useEffect(() => {
        fetch("https://forinterview.onrender.com/people")
            .then((response) => response.json())
            .then((data) => {
                setCandidates(data);
            })
            .catch((error) => {
                console.error("Error fetching candidates:", error);
            });
    }, []);

    return (
        <div className={styles.main}>
            <div className={styles.backButtonContainer}>
                <Image
                    src={"/back-icon.png"}
                    alt="Back"
                    width={16}
                    height={16}
                />
                <div className={styles.backButton}>Back to My Jobs</div>
            </div>
            <div className={styles.positionContainer}>
                <div className={styles.positionTitle}>
                    Posk_UXdesigner_sr001
                </div>
                <div className={styles.totalCandidates}>23 Candidates</div>
            </div>
            <div className={styles.candidateHeatMapContainer}>
                <div className={styles.candidatesListContainer}>
                    <div className={styles.candiatesListTitle}>
                        Most Recommended
                    </div>
                    <div className={styles.candidatesList}>
                        {candidates.map((candidate) => (
                            <div
                                key={candidate.id}
                                className={styles.candidateCard}
                            >
                                <div className={styles.candidateNameAndImage}>
                                    <div className={styles.candidateImage}>
                                        <Image
                                            src={"/avatar.png"}
                                            alt="Candidate Avatar"
                                            width={24}
                                            height={24}
                                        />
                                    </div>
                                    <div className={styles.candidateName}>
                                        {candidate?.name || ""}
                                    </div>
                                </div>
                                <div
                                    onClick={() =>
                                        handleCandidateClick(candidate)
                                    }
                                    className={styles.selectButton}
                                >
                                    {selectedCandidates.some(
                                        (c) => c.id === candidate.id
                                    ) ? (
                                        <Image
                                            src={"/minus-icon.png"}
                                            alt="Selected Candidate"
                                            width={24}
                                            height={24}
                                        />
                                    ) : (
                                        <Image
                                            src={"/plus-icon.png"}
                                            alt="Select Candidate"
                                            width={24}
                                            height={24}
                                        />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className={styles.filterAndHeatMapContainer}>
                    <div className={styles.SkillContainer}>
                        <div
                            onClick={() => setDropdownVisible((prev) => !prev)}
                            className={styles.filterButton}
                        >
                            Filter
                        </div>
                        {dropdownVisible && (
                            <div className={styles.dropdown}>
                                {skills.map((skill, index) => (
                                    <label
                                        key={index}
                                        className={styles.dropdownItem}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={filteredSkills.includes(
                                                skill
                                            )}
                                            onChange={() => toggleSkill(skill)}
                                        />
                                        {skill}
                                    </label>
                                ))}
                            </div>
                        )}
                        <div className={styles.skillLabels}>
                            {filteredSkills.map((skill, index) => (
                                <div key={index} className={styles.skillLabel}>
                                    {skill}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={styles.heatMapContainer}>
                        {selectedCandidates.length === 0 && (
                            <div className={styles.noCandidates}>
                                Select Candidate to Compare
                            </div>
                        )}
                        {selectedCandidates.map((candidate) => (
                            <CandidateHeatMap
                                candidate={candidate}
                                skills={filteredSkills}
                                key={candidate.id}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
