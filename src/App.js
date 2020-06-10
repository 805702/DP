import React from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import { connect } from "react-redux";

import { setUser } from './store/actions/user.actions'

import SendMail from './auth/signIn/pages/SendMail';
import SignUp from './auth/signUp/pages/SignUp'
import SignIn from './auth/signIn/pages/SignIn';
import ForgotPassword from './auth/signIn/pages/ForgotPwd';
import TeacherTimetable from './enseignant/TeacherTimetable';
import TeacherNotes from './enseignant/TeacherNotes';
import Questionnaire from './enseignant/Questionnaire';
import CorrigerEvaluation from './enseignant/CorrigerEvaluation';
import StudentTimetable from './etudiants/StudentTimetable';
import Examen from './etudiants/Examen';
import Devoir from './etudiants/Devoir';
import StudentNotes from './etudiants/StudentNotes';
import TeacherCourses from './secretaire/components/attribuerCoursEnseignant/TeacherCourses.jsx';
import ManagePersonnel from './secretaire/components/manage personnel/ManagePersonnel';
import Settings from './secretaire/pages/Settings';
import TimeTableFormat from './coordonateur/components/TimeTableFormat';
import PublierNoteExamen from './coordonateur/components/PublierNoteExamen';
import TeacherForum from './enseignant/TeacherForum';
import StudentForum from './etudiants/StudentForum';
import CreateStudents frsom './secretaire/components/CreateStudents';
import DisplayStudents from './secretaire/components/DisplayStudents';

class App extends React.Component {
    render() {
        // console.log(this.props)
        return ( <
            Router >
            <
            Switch >
            <
            Route exact path = '/theStudents' > < DisplayStudents / > < /Route> <
            Route exact path = '/coordo' > < TimeTableFormat / > < /Route> <
            Route exact path = '/coordo/publish-notes' > < PublierNoteExamen / > < /Route> <
            Route exact path = '/teacher' > < TeacherTimetable / > < /Route>  <
            Route exact path = '/teacher/questionnaire' > < Questionnaire / > < /Route> <
            Route exact path = '/teacher/correct' > < CorrigerEvaluation / > < /Route> <
            Route exact path = '/teacher/notes' > < TeacherNotes / > < /Route> <
            Route exact path = '/teacher/courses' > < TeacherCourses / > < /Route> <
            Route exact path = '/manage-personnels' > < ManagePersonnel / > < /Route> <
            Route exact path = '/teacher/forum/:idCour'
            component = { TeacherForum }
            /> <
            Route exact path = '/student/forum/:idCour'
            component = { StudentForum }
            /> <
            Route exact path = '/settings' > < Settings / > < /Route> <
            Route exact path = '/resetpwd' > < ForgotPassword / > < /Route>  <
            Route exact path = '/sendMail' > < SendMail / > < /Route> <
            Route exact path = '/signup' > < SignUp / > < /Route>  <
            Route exact path = '/newstudent' > < CreateStudents / > < /Route> <
            Route exact path = '/'
            render = {
                () => {
                    if (this.props.user._id) {
                        switch (this.props.user.role) {
                            case "secretaire":
                                return <Redirect to = '/manage-personnels' / > ;
                            case "coordonateur":
                                return <Redirect to = '/coordo' / > ;
                            case "enseignant":
                                return <Redirect to = '/teacher' / > ;
                            default:
                                return <Redirect to = '/student' / >
                        }
                    } else { return ( < SignIn / > ) }
                }
            }
            />  <
            Route exact path = '/student' > < StudentTimetable / > < /Route> <
            Route exact path = '/student/examen' > < Examen / > < /Route> <
            Route exact path = '/student/devoir' > < Devoir / > < /Route> <
            Route exact path = '/student/note' > < StudentNotes / > < /Route> <
            Redirect to = '/' / >
            <
            /Switch> < /
            Router >
        );
    }
}
const mapDispatchToProps = dispatch => ({
    setUser: (user) => dispatch(setUser(user)),
})
const mapStateToProps = state => ({
    user: state.User.user
})

export default connect(mapStateToProps, mapDispatchToProps)(App);