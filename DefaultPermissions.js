import React from 'react';
import { useState,useEffect,createContext } from 'react';
export const AppContext = createContext();

const DefaultPermissions = () => {
   
    const [perdata,setPerData] = useState({selected:{}});
    const [DriverRules, setDriverRules] = useState([]);
    const [Users, setUsers] = useState([]);

     useEffect(()=> {

        fetch("https://webapi3.shuttleq.net/api/UserManagement/GetAllUsersAccess?companyId=4091&status=1")
            .then((res) => res.json())
            .then((json) => {
                
              let newSelected = {};
              const newdata = json.data;
              newdata.map((permission) => newSelected[permission.userId+"_"+permission.typeId] = permission.access );
              setPerData({selected:newSelected});
              setDriverRules(json.driverRules);
              setUsers(json.totalResponce);

            }); 

     },[])

    

   const handlePerClick = (userId,ruleId) => { 
    
    let  newdata = perdata.selected;
    newdata[userId+'_'+ruleId] = !newdata[userId+'_'+ruleId];
    setPerData({selected:newdata});

  }

  const onRowChange = (e,userId) => {
    let isChecked = e.target.checked;
    let  newdata = perdata.selected;

     DriverRules?.map((rule) => {
        if(isChecked == true){
          newdata[userId+'_'+rule.id] = true;
        }else{
          newdata[userId+'_'+rule.id] = false;
        }
     });
     setPerData({selected:newdata});

  }

  const onColumnChange = (e,ruleId) => {
    let isChecked = e.target.checked;
    let  newdata = perdata.selected;

    Users?.map((user) => {
        if(isChecked == true){
          newdata[user.userId+'_'+ruleId] = true;
        }else{
          newdata[user.userId+'_'+ruleId] = false;
        }
     });
     setPerData({selected:newdata});

  }

  return (
    <AppContext.Provider value={perdata} > 
<div>
  <table>
      
            <thead>
              <tr>
              <th></th>
              <th>Username</th>
              {DriverRules.map((rule) => {
                return(
                  <th><input type='checkbox' onClick={(e) => onColumnChange(e,rule.id)} /></th>
                )
              })}
              </tr>
            </thead>
            <tbody>
        {Users?.map(( user ) => {

          return(

                  <tr>
                  <td><input type='checkbox' onClick={(e) => onRowChange(e,user.userId)} /></td>  
                  <td>{user.firstName}</td> 
                  
                  {

                    DriverRules.map((rule) => {
                      
                      return (  
                        <td>
                          <input type="checkbox" onClick={() => handlePerClick(user.userId,rule.id)} checked={perdata.selected[user.userId+'_'+rule.id]}  /><p>{user.userId}_{rule.id}</p>
                        </td>
                      );
                    })

                  }  

                  </tr>

          ) 
          
      })}
            
      </tbody>
    </table>
</div>
     
     </AppContext.Provider>
  )
}

export default DefaultPermissions


