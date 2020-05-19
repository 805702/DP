import React from 'react'

import './TimeTableLine.css'

export default function TimeTableLine(props) {
    return (
        props.type!=='th'?(
            <div className='LineHolder'>
            <div className="columnTime">
                <span className='hmm'>
                    <h3>Debut: </h3><span id='fromTime'>{props.line.debut}</span>
                    {/* <input type='text' id='fromTime' value='18:00' /> */}
                </span>
                <span>
                    <h3>Fin: </h3><span id='toTime'>{props.line.fin}</span>
                    {/* <input type="text" id='toTime' value='20:00' /> */}
                </span>
            </div>
            <div className="columnDay" >
                <select id='mon_cours' className='selectCours coursPadding' value={props.line.mon.cour} onChange={(e)=>props.lineNumber(props.line.index, e)}>
                    <option hidden>Quel Cours</option>
                    {props.cours}
                    </select>
                <select id='mon_salle' className='selectCours' value={props.line.mon.salle} onChange={(e)=>props.lineNumber(props.line.index, e)}>
                    <option hidden>Salle</option>
                    {props.salles}
                </select>
            </div>
            <div className="columnDay">
                <select id='tue_cours' className='selectCours coursPadding' value={props.line.tue.cour} onChange={(e)=>props.lineNumber(props.line.index, e)}>
                    <option hidden >Quel Cours</option>
                    {props.cours}
                    </select>
                <select id='tue_salle' className='selectCours' value={props.line.tue.salle} onChange={(e)=>props.lineNumber(props.line.index, e)}>
                    <option hidden >Salle</option>
                    {props.salles}
                </select>
            </div>
            <div className="columnDay">
                <select id='wed_cours' className='selectCours coursPadding' value={props.line.wed.cour} onChange={(e)=>props.lineNumber(props.line.index, e)}>
                    <option hidden >Quelle Cours</option>
                    {props.cours}
                    </select>
                <select id='wed_salle' className='selectCours' value={props.line.wed.salle} onChange={(e)=>props.lineNumber(props.line.index, e)}>
                    <option hidden >Salle</option>
                    {props.salles}
                </select>
            </div>
            <div className="columnDay">
                <select id='thur_cours' className='selectCours coursPadding' value={props.line.thur.cour} onChange={(e)=>props.lineNumber(props.line.index, e)}>
                    <option hidden >Quelle Cours</option>
                    {props.cours}
                    </select>
                <select id='thur_salle' className='selectCours' value={props.line.thur.salle} onChange={(e)=>props.lineNumber(props.line.index, e)}>
                    <option hidden >Salle</option>
                    {props.salles}
                </select>
            </div>
            <div className="columnDay">
                <select id='fri_cours' className='selectCours coursPadding' value={props.line.fri.cour} onChange={(e)=>props.lineNumber(props.line.index, e)}>
                    <option hidden >Quelle Cours</option>
                    {props.cours}
                    </select>
                <select id='fri_salle' className='selectCours' value={props.line.fri.salle} onChange={(e)=>props.lineNumber(props.line.index, e)}>
                    <option hidden >Salle</option>
                    {props.salles}
                </select>
            </div>
            <div className="columnDay">
                <select id='sat_cours' className='selectCours coursPadding' value={props.line.sat.cour} onChange={(e)=>props.lineNumber(props.line.index, e)}>
                    <option hidden >Quelle Cours</option>
                    {props.cours}
                    </select>
                <select id='sat_salle' className='selectCours' value={props.line.sat.salle} onChange={(e)=>props.lineNumber(props.line.index, e)}>
                    <option hidden >Salle</option>
                    {props.salles}
                </select>
            </div>
            <div className="columnDay">
                <select id='sun_cours' className='selectCours coursPadding' value={props.line.sun.cour} onChange={(e)=>props.lineNumber(props.line.index, e)}>
                    <option hidden >Quelle Cours</option>
                    {props.cours}
                    </select>
                <select id='sun_salle'className='selectCours' value={props.line.sun.salle}  onChange={(e)=>props.lineNumber(props.line.index, e)}>
                    <option hidden >Salle</option>
                    {props.salles}
                </select>
            </div>
        </div>
            ):(
            <div className='LineHolder'>

            <div className="columnTime th">
            </div>
            <div className="columnDay th">
                Lundi
            </div>
            <div className="columnDay th">
                Mardi
            </div>
            <div className="columnDay th">
                Mercredi
            </div>
            <div className="columnDay th">
                Jeudi
                </div>
            <div className="columnDay th">
                Vendredi
            </div>
            <div className="columnDay th">
                Samedi
            </div>
            <div className="columnDay th">
                Dimanche
            </div>
        </div>
            )
    )
}
