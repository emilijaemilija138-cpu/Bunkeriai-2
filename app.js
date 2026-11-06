"use strict";
(function(){
  var menuToggle=document.getElementById("menuToggle");
  var mobileMenu=document.getElementById("mobileMenu");
  if(menuToggle&&mobileMenu){
    function closeMenu(){mobileMenu.hidden=true;menuToggle.setAttribute("aria-expanded","false");menuToggle.setAttribute("aria-label","Atidaryti meniu");}
    menuToggle.addEventListener("click",function(){
      var willOpen=mobileMenu.hidden;
      mobileMenu.hidden=!willOpen;
      menuToggle.setAttribute("aria-expanded",String(willOpen));
      menuToggle.setAttribute("aria-label",willOpen?"Uždaryti meniu":"Atidaryti meniu");
    });
    mobileMenu.querySelectorAll("a").forEach(function(a){a.addEventListener("click",closeMenu)});
    document.addEventListener("keydown",function(e){if(e.key==="Escape")closeMenu()});
    document.addEventListener("click",function(e){if(!mobileMenu.hidden&&!mobileMenu.contains(e.target)&&!menuToggle.contains(e.target))closeMenu()});
  }
  var year=document.getElementById("year");
  if(year)year.textContent=String(new Date().getFullYear());

  var form=document.getElementById("quoteForm");
  if(!form)return;
  document.querySelectorAll("[data-pick]").forEach(function(button){
    button.addEventListener("click",function(){
      var val=button.getAttribute("data-pick");
      var choice=Array.from(form.querySelectorAll('input[name="package"]')).find(function(i){return i.value===val});
      if(choice)choice.checked=true;
      document.getElementById("uzklausa").scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"});
    });
  });

  var preparedText="";
  function s(value){return String(value||"").trim();}
  form.addEventListener("submit",function(event){
    event.preventDefault();
    if(!form.reportValidity())return;
    var data=new FormData(form);
    var extras=data.getAll("extras");
    var fields=[
      "NORDSTATE SHELTER — NAUJO PROJEKTO UŽKLAUSA",
      "",
      "Sprendimas: "+s(data.get("package")),
      "Vardas / įmonė: "+s(data.get("name")),
      "Telefonas: "+(s(data.get("phone"))||"Nenurodytas"),
      "El. paštas: "+s(data.get("email")),
      "Vieta: "+(s(data.get("location"))||"Nenurodyta"),
      "Žmonių skaičius: "+s(data.get("people")),
      "Objekto tipas: "+s(data.get("site")),
      "Papildomai domina: "+(extras.length?extras.join(", "):"Nenurodyta"),
      "",
      "Papildoma informacija:",
      s(data.get("message"))||"Nenurodyta",
      "",
      "Užklausa paruošta NordState Shelter svetainėje."
    ];
    preparedText=fields.join("\n");
    var subject="NordState Shelter — užklausa: "+s(data.get("package"))+" / "+s(data.get("name"));
    var mailto="mailto:info@nordstate.shop?subject="+encodeURIComponent(subject)+"&body="+encodeURIComponent(preparedText);
    var fallback=document.getElementById("emailFallback");
    if(fallback){fallback.hidden=false;fallback.scrollIntoView({behavior:"smooth",block:"nearest"});}
    window.location.href=mailto;
  });

  var copyButton=document.getElementById("copyRequest");
  if(copyButton){
    copyButton.addEventListener("click",async function(){
      var status=document.getElementById("copyStatus");
      try{
        if(navigator.clipboard&&window.isSecureContext){
          await navigator.clipboard.writeText(preparedText);
        }else{
          var area=document.createElement("textarea");
          area.value=preparedText;area.style.position="fixed";area.style.opacity="0";
          document.body.appendChild(area);area.select();
          var copied=document.execCommand("copy");document.body.removeChild(area);
          if(!copied)throw new Error("No clipboard");
        }
        if(status)status.textContent="Užklausos tekstas nukopijuotas. Išsiųskite jį info@nordstate.shop";
        copyButton.textContent="Nukopijuota ✓";
      }catch(e){
        if(status)status.textContent="Kopijavimas nepasiekiamas. Atidarykite savo el. pašto programą ir įveskite užklausą rankiniu būdu.";
      }
    });
  }
})();