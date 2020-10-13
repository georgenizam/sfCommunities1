({
  doInit: function(component, event, helper) {  
      component.set("v.Spinner", true);    
      
      const date = +Date.now();
      const dateEndWeek = new Date(date);      
      const dateStartWeek = new Date(date);
      dateStartWeek.setDate(dateStartWeek.getDate() - 7);
      component.set("v.weekTimes", {  startWeek: `${dateStartWeek.getDate()}/${dateStartWeek.getMonth()}/${dateStartWeek.getFullYear()}`, 
                                      endWeek: `${dateEndWeek.getDate()}/${dateEndWeek.getMonth()}/${dateEndWeek.getFullYear()}` });

      let action = component.get("c.getListLeadsToday");      
      action.setParams({
        "curTime" : date
      });         
      action.setCallback(this, function(response) {
          let state = response.getState();
          if (state === "SUCCESS") {            
            const res = response.getReturnValue();            

            let maxLeadsOnWeekday = 0;
            for (let i=0; i<7; i++) {
              maxLeadsOnWeekday = res[`weekday-${i}`] > maxLeadsOnWeekday ? res[`weekday-${i}`] : maxLeadsOnWeekday;
            }
            
            component.set("v.setMeOnInit", { 
              amountToday: res.amountToday,
              amount7Days: res.amountWeek,
              amount30Days: res.amountMonth,
              amountAllTime: res.amountAllTime
            });
            console.log({ amountLeadsToday: res.amountToday, amountLeads7Days: res.amountWeek,  amountLeads30Days: res.amountMonth, amountLeadsAllTime: res.amountAllTime});
            component.set("v.bars", { 
              0: { percent: (res["weekday-0"] / maxLeadsOnWeekday) * 100, amount: res["weekday-0"] },
              1: { percent: (res["weekday-1"] / maxLeadsOnWeekday) * 100, amount: res["weekday-1"] },
              2: { percent: (res["weekday-2"] / maxLeadsOnWeekday) * 100, amount: res["weekday-2"] },
              3: { percent: (res["weekday-3"] / maxLeadsOnWeekday) * 100, amount: res["weekday-3"] },
              4: { percent: (res["weekday-4"] / maxLeadsOnWeekday) * 100, amount: res["weekday-4"] },
              5: { percent: (res["weekday-5"] / maxLeadsOnWeekday) * 100, amount: res["weekday-5"] },
              6: { percent: (res["weekday-6"] / maxLeadsOnWeekday) * 100, amount: res["weekday-6"] },
            });         
            component.set("v.Spinner", false);
          }          
      })
      $A.enqueueAction(action);      
  }  
})