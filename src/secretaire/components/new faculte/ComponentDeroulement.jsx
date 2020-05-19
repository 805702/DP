import React, {Component} from 'react'

/*	Component	*/


/*	 Style	*/
import  './componentderoulement.css'

class ComponentDeroulment extends Component
{
	state = {
		data: ["donnee1", "donnee2", "donnee3"],
		key : 0,
		open:''
	}
	
	changeToAngleDown=(elementID)=>{
		let elementClasslist=document.getElementById(elementID).classList
		elementClasslist.remove('fa-angle-up')
		elementClasslist.add('fa-angle-down')			
		this.setState({open:''})
	}


	handleOpenFaculte=(whatFaculty)=>{
		let elementClasslist=document.getElementById(whatFaculty).classList
		if(elementClasslist.contains('fa-angle-down')){
			if(this.state.open!==''){this.changeToAngleDown(this.state.open)}
			elementClasslist.remove('fa-angle-down')
			elementClasslist.add('fa-angle-up')
			this.setState({open:whatFaculty})
		}else{
			elementClasslist.remove('fa-angle-up')
			elementClasslist.add('fa-angle-down')			
			this.setState({open:''})
		}
	}
	
	displayFacultyData=()=>{
		return this.props.facultes.map(faculty=>(
			<div className="facultyData" key={'faculty'+faculty.index} >
				<div className='facultyHead' onClick={()=>this.handleOpenFaculte('faculty'+faculty.index)}>
					<span className="CDTitle">{faculty.nomFaculte}</span>
					<div className="endPart">
						<input type='button' value='Delete' className='deleteFaculty' onClick={()=>this.props.handleDeleteFaculty(faculty.index)}/>
						<span className="CDIcon"><i id={'faculty'+faculty.index} className='fa fa-2x fa-angle-down' /></span>
					</div>
				</div>
				{
					this.state.open==='faculty'+faculty.index?
					<div className="facultyFilieres" key={'FacultyFilieres'+faculty.index}>
						<div className="facultyFiliereHeader"></div>
						{
							faculty.filieres.map(filiere=>(
								<div className='facultyFiliereData' key={faculty.nomFaculte+filiere.nomFiliere}>
									<h3>{filiere.index}</h3>
									<h3>{filiere.nomFiliere}</h3>
									<h3>{filiere.niveauMax}</h3>
								</div>
							))
						}
					</div>:null
				}
			</div>
		))
	}

	render()
	{
		return(
			this.displayFacultyData()
		)
	}
}

export default ComponentDeroulment