$(document).ready(function() {

  /**
   * Calculate the average percent similarity of two submissions.
   *
   * studentOneStr is like 	
   * "submissions/PA0/zhangyiyan_12670_1603194_BFSearch.java (94%)"
   */
  percentExtractor = /\((\d+)\%\)/
  function averagePercentSimilarity(studentOneStr, studentTwoStr) {
    var pctOne = percentExtractor.exec(studentOneStr)[1],
        pctTwo = percentExtractor.exec(studentTwoStr)[1];

    return (parseFloat(pctOne) + parseFloat(pctTwo)) / 2.0;
  }
  
  /**
   * Check if two student submissions are from the same student.
   *
   * studentOneStr is like 	
   * "submissions/PA0/zhangyiyan_12670_1603194_BFSearch.java (94%)"
   */
  function sameStudent(studentOneStr, studentTwoStr) {
    var studentOne = 
          studentOneStr
            .split("/")[2]
            .split("_")[0],

        studentTwo = 
          studentTwoStr
            .split("/")[2]
            .split("_")[0];

    return studentOne === studentTwo;
  }

  /**
   * MANIPULATING GRADES TABLE 
   */
  var gradeTable = $("#gradesTable");
  gradeTable.find('tr > th').eq(2).text("APS");

  var toDelete = [];
    
  gradeTable.find('tr').each(

    (idx, el) => 
    {
      // Ignore the first table row, the table header
      if (idx > 0) 
      {
        var rowData = el.children,
            studentOneStr = rowData[0].textContent.trim(),
            studentTwoStr = rowData[1].textContent.trim();

        if (sameStudent(studentOneStr, studentTwoStr)) 
        {
          el.remove();
        } 
        else
        {
          aps = averagePercentSimilarity(studentOneStr, studentTwoStr);
          rowData[2].textContent = aps;

          el.setAttribute("data-aps", aps);
        }
      }
      else
      {
        // Hacky way to keep header on top.
        el.setAttribute("data-aps", 101);
      }
    }    

  );


  // gradeTableNoHeader.sort
  function applyMinimumAPS(minimumAPS) {
    gradeTable.find('tr').each(
      (idx, el) =>
      {
        if (idx > 0) 
        {
          var APS = parseFloat(el.children[2].textContent);

          el.hidden = APS < minimumAPS;
        }
      }
    );
  }

  tinysort($('#gradesTable tr'), {data: 'aps', order: 'desc'});

  $('#minimumAPSValue').keyup(
    (event) =>
    {
      console.log('in the keyup prelim');
      if (event.which === 13) 
      {
        console.log('in here');
        $('#applyMinimumAPS').click();
      }
  });

  $('#applyMinimumAPS').click(
    () => {
      applyMinimumAPS(parseFloat($('#minimumAPSValue').val()));
    }
  );
});
