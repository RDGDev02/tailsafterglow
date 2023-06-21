const BackgroundTraits = [];
const BodyTraits = [];
const EyesTraits = [];
const ClothingTraits = [];
const EyepieceTraits = [];
const MouthpieceTraits = [];
const HeadwearTraits = [];
const SetTraits = [];
var tcount = 4266;

$(document).ready(function () {
  
    
    $('#content').html('');
    loadRarityTraits();
    reset('asc');
    loadFilters();
    window.onscroll = function(ev) {
        if (((window.innerHeight + window.scrollY) >= document.body.offsetHeight) && $('#btnloadmore').is(":visible")) {
            loadmore();
        }
    };
    var timer = null;
        $('#tSearch').keydown(function(){
            clearTimeout(timer); 
            $('#loading').html('<div class="spinner-border text-danger" role="status"> </div>');
            timer = setTimeout(SearchTAG, 1000);
            
            
        });

    
});


function loadmore(sorting){

    var data = $('#dt').val(); //retrieve array
    data = JSON.parse(data);

    var lastrecord = parseInt($('#lastrecord').val());
    var sorting = $('#sorting').val();

    var newendrecord = 0;

    if(checkAllcheckboxesBackground() == true ||
    checkAllcheckboxesBody() == true ||
    checkAllcheckboxesClothing() == true ||
    checkAllcheckboxesEyepiece() == true ||
    checkAllcheckboxesEyes() == true ||
    checkAllcheckboxesHeadwear() == true ||
    checkAllcheckboxesMouthpiece() == true ||
    checkAllcheckboxesSet() == true)
    {
        newendrecord = lastrecord + 500;
    }else
    {
        newendrecord = lastrecord + 24;
    }


    let ishowBg = false;
    let ishowBody = false;
    let ishowClothing = false;
    let ishowEyepiece = false;
    let ishowEyes = false;
    let ishowHeadwear = false;
    let isMouthpiece = false;
    let ishowSet = false;

    if(newendrecord > tcount)
    {
        newendrecord = tcount;
    }

    //console.log(lastrecord);
    //console.log(newendrecord);
    let norec= 0 ;

    for(var i=lastrecord; i < newendrecord; i++)
        {
            let rank = 0;
            if(sorting == 'asc') {
             rank = (i + 1);
            }
            else {
             rank = tcount - i;
            }

            

            if((checkAllcheckboxesBackground() == false || ishowBg == true) && 
                (checkAllcheckboxesBody() == false || ishowBody == true) && 
                (checkAllcheckboxesClothing() == false || ishowClothing == true) && 
                (checkAllcheckboxesEyepiece() == false || ishowEyepiece == true) && 
                (checkAllcheckboxesEyes() == false || ishowEyes == true) && 
                (checkAllcheckboxesHeadwear() == false || ishowHeadwear == true) && 
                (checkAllcheckboxesMouthpiece() == false || isMouthpiece == true) && 
                (checkAllcheckboxesSet() == false || ishowSet == true)
                )
            {
                norec++;
            let imgTrim = data[i]["image"].replace('ipfs://QmcQYyYKkeunXfuPAoxuvWLh8fa2DnyfmZ25e5ZGnJBw8T','');
            let img = "https://cdn.tailsafterglow.io/ipfs/images" + imgTrim;
            cont = "<div class='col-6 col-sm-6 col-md-4 col-lg-2 grid-view-item style2 item'>" +
                        "<div class='grid-view_image'>" +
                            "<a onclick='openTraits(\"" + data[i]["name"] + "\"," + rank + "," + data[i]["score"] + ",\""  + data[i]["image"] + "\"," + data[i]["background"] + "," + data[i]["body"] + "," + data[i]["eyes"] + "," + data[i]["clothing"] + "," + data[i]["eyepiece"] + "," + data[i]["mouthpiece"] + "," + data[i]["headwear"] + "," + data[i]["set"] + ")' class='grid-view-item__link'>" +
                                "<img class='grid-view-item__image lazyload bg-image hover-zoom' data-src='" + img + "' alt='" + data[i]["name"] + "' title='" + data[i]["name"] + "' >" +
                                "<div class='product-labels rectangular'><span class='lbl on-sale'>RANK #" + rank + "</span></div>" +         
                            "</a>" +
                            "<div class='product-details text-center'>" +
                                "<div class='product-name'><span class='price desSize'>" + data[i]["name"] + "</span></div>" +
                            "</div>" +
                        "</div>" +
                    "</div>";

            $('#content').append(cont);
            }

            
        }

    $('#lastrecord').val(newendrecord);

    
}

function reset(sorting)
{

    $('#loading').html('<div class="spinner-border text-danger" role="status"> </div>');
    $('#content').html('');
    $('#tSearch').val("");
    $('#lastrecord').val('0');
    let NFTs = [];
    
    
    $.getJSON("assets/data/_metadata.json",
    
    function (data) {
        
        $.each(data, function (key, value) {
            
            //console.log(value);

            let name = value.name;
            let imageurl = value.image;

            //console.log(name);

            let vbackground = JSON.stringify(value.attributes[0]["value"]);
            let vbody = JSON.stringify(value.attributes[1]["value"]);
            let veyes = JSON.stringify(value.attributes[2]["value"]);
            let vclothing = JSON.stringify(value.attributes[3]["value"]);
            let veyepiece = JSON.stringify(value.attributes[4]["value"]);
            let vmouthpiece = JSON.stringify(value.attributes[5]["value"]);
            let vheadwear = JSON.stringify(value.attributes[6]["value"]);
            let vset = JSON.stringify(value.attributes[7]["value"]);
            
            let score = calculateRarityScore(vbackground,vbody,veyes, vclothing,veyepiece,vmouthpiece,vheadwear,vset);

                NFTs.push(new TAGNFT(name,imageurl,score, 
                    vbackground,
                    vbody,
                    veyes,
                    vclothing,
                    veyepiece,
                    vmouthpiece,
                    vheadwear,
                    vset));
            
            
        });
        let sortNFT = '';
        //console.log(sorting);
        if(sorting == 'asc')
        {
            sortNFT = NFTs.sort((a, b) => parseFloat(b.score) - parseFloat(a.score));
        }
        if(sorting == 'desc')
        {
            sortNFT = NFTs.sort((a, b) => parseFloat(a.score) - parseFloat(b.score));
        }
        //sortNFT = NFTs.sort((a, b) => parseFloat(b.score) - parseFloat(a.score));
        //console.log(sortNFT);
        $('#dt').val(JSON.stringify(sortNFT));
        $('#lastrecord').val(24);
        $('#sorting').val(sorting);
        //console.log(sortNFT);
        
        
        loadContent(sortNFT,0,24,"All","",sorting);
        
    });
}

function loadContent(data, startrecord, endrecord, filtertype, val, sorting){
   
   //console.log(data);
   let counter = 0;
    let ishowBg = false;
    let ishowBody = false;
    let ishowClothing = false;
    let ishowEyepiece = false;
    let ishowEyes = false;
    let ishowHeadwear = false;
    let isMouthpiece = false;
    let ishowSet = false;

    let cont = "";
    
    if(filtertype == 'All')
    {
        let norec= 0;
        

        if(checkAllcheckboxesBackground() == true ||
                checkAllcheckboxesBody() == true ||
                checkAllcheckboxesClothing() == true ||
                checkAllcheckboxesEyepiece() == true ||
                checkAllcheckboxesEyes() == true ||
                checkAllcheckboxesHeadwear() == true ||
                checkAllcheckboxesMouthpiece() == true ||
                checkAllcheckboxesSet() == true)
            {
               //endrecord = 500;
               endrecord = tcount;
            }
        for(var i=startrecord; i < endrecord; i++)
        {
            var rank = 0;
           if(sorting == 'asc') {
            rank = (i + 1);
           }
           else {
            rank = tcount - i;
           }
           
            ishowBg = checkiffiltered('Background',data[i]["background"]);
            ishowBody = checkiffiltered('Body',data[i]["body"]);
            ishowClothing = checkiffiltered('Clothing',data[i]["clothing"]);
            ishowEyepiece = checkiffiltered('Eyepiece',data[i]["eyepiece"]);
            ishowEyes = checkiffiltered('Eyes',data[i]["eyes"]);
            ishowHeadwear = checkiffiltered('Headwear',data[i]["headwear"]);
            isMouthpiece = checkiffiltered('Mouthpiece',data[i]["mouthpiece"]);
            ishowSet = checkiffiltered('Set',data[i]["set"]);
           
            /*
            console.log(checkAllcheckboxesBackground() + '__' + ishowBg == true);
            console.log(checkAllcheckboxesBody() + '__' + ishowBody == true);
            console.log(checkAllcheckboxesClothing() + '__' + ishowClothing == true);
            console.log(checkAllcheckboxesEyepiece() + '__' + ishowEyepiece == true);
            console.log(checkAllcheckboxesEyes() + '__' + ishowEyes == true);
            console.log(checkAllcheckboxesHeadwear() + '__' + ishowHeadwear == true);
            console.log(checkAllcheckboxesMouthpiece() + '__' + isMouthpiece == true);
            console.log(checkAllcheckboxesSet() + '__' + ishowSet == true);
           */
            
           if((checkAllcheckboxesBackground() == false || ishowBg == true) && 
                (checkAllcheckboxesBody() == false || ishowBody == true) && 
                (checkAllcheckboxesClothing() == false || ishowClothing == true) && 
                (checkAllcheckboxesEyepiece() == false || ishowEyepiece == true) && 
                (checkAllcheckboxesEyes() == false || ishowEyes == true) && 
                (checkAllcheckboxesHeadwear() == false || ishowHeadwear == true) && 
                (checkAllcheckboxesMouthpiece() == false || isMouthpiece == true) && 
                (checkAllcheckboxesSet() == false || ishowSet == true)
                )
            {
                
                norec++;
                
                let imgTrim = data[i]["image"].replace('ipfs://QmcQYyYKkeunXfuPAoxuvWLh8fa2DnyfmZ25e5ZGnJBw8T','');
                let img = "https://cdn.tailsafterglow.io/ipfs/images" + imgTrim;
                cont = "<div class='col-6 col-sm-6 col-md-4 col-lg-2 grid-view-item style2 item'>" +
                            "<div class='grid-view_image'>" +
                                "<a onclick='openTraits(\"" + data[i]["name"] + "\"," + rank + "," + data[i]["score"] + ",\""  + data[i]["image"] + "\"," + data[i]["background"] + "," + data[i]["body"] + "," + data[i]["eyes"] + "," + data[i]["clothing"] + "," + data[i]["eyepiece"] + "," + data[i]["mouthpiece"] + "," + data[i]["headwear"] + "," + data[i]["set"] + ")' class='grid-view-item__link'>" +
                                    "<img class='grid-view-item__image lazyload bg-image hover-zoom' data-src='" + img + "' alt='" + data[i]["name"] + "' title='" + data[i]["name"] + "' >" +
                                    "<div class='product-labels rectangular'><span class='lbl on-sale'>RANK #" + rank + "</span></div>" +         
                                "</a>" +
                                "<div class='product-details text-center'>" +
                                    "<div class='product-name'><span class='price desSize'>" + data[i]["name"] + "</span></div>" +
                                "</div>" +
                            "</div>" +
                        "</div>";

                $('#content').append(cont);
                
                
                
                
            }
            if(norec > 0 && norec != 24){
                $('#tagCount').text('TAG:' + norec);
            }
            else if(norec == 0){
                $('#tagCount').text('TAG:0');
            }
            else{
                $('#tagCount').text('TAG:' + tcount);
               
            }

            
            
           

        }
            $('#btnloadmore').show();
        
        
    }
    if(filtertype == 'byTagNo')
    {
        
        for(var i=0; i < endrecord; i++)
        {
            let nn = data[i]["name"];
            const nnArr = nn.split("#");
           // console.log(i);

            if(nnArr[1] == val)
            {
                let imgTrim = data[i]["image"].replace('ipfs://QmcQYyYKkeunXfuPAoxuvWLh8fa2DnyfmZ25e5ZGnJBw8T','');
                let img = "https://cdn.tailsafterglow.io/ipfs/images" + imgTrim;
                cont = "<div class='col-6 col-sm-6 col-md-4 col-lg-2 grid-view-item style2 item'>" +
                            "<div class='grid-view_image'>" +
                                "<a onclick='openTraits(\"" + data[i]["name"] + "\"," + (i + 1) + "," + data[i]["score"] + ",\""  + data[i]["image"] + "\"," + data[i]["background"] + "," + data[i]["body"] + "," + data[i]["eyes"] + "," + data[i]["clothing"] + "," + data[i]["eyepiece"] + "," + data[i]["mouthpiece"] + "," + data[i]["headwear"] + "," + data[i]["set"] + ")' class='grid-view-item__link'>" +
                                    "<img class='grid-view-item__image lazyload bg-image hover-zoom' data-src='" + img + "' alt='" + data[i]["name"] + "' title='" + data[i]["name"] + "' >" +
                                    "<div class='product-labels rectangular'><span class='lbl on-sale'>RANK #" + (i + 1) + "</span></div>" +         
                                "</a>" +
                                "<div class='product-details text-center'>" +
                                    "<div class='product-name'><span class='price desSize'>" + data[i]["name"] + "</span></div>" +
                                "</div>" +
                            "</div>" +
                        "</div>";
                        $('#content').append(cont);
                        $('#tagCount').text('TAG:1');
                        return;
                
            }
            
            
        }
        
        $('#tagCount').text('TAG:0');
        $('#content').html('<div class="row"><div class="col-lg-12"><div class="alert alert-dark">TAG not found. Please try again.</span></div></div>');
        
    }
   
    $('#loading').html('');
    
    //$('#content').html(cont);
}

function openTraits(name, rank,score,img, background, body, eyes, clothing, eyepiece, mouthpiece, headwear, set){
    let imgTrim = img.replace('ipfs://QmcQYyYKkeunXfuPAoxuvWLh8fa2DnyfmZ25e5ZGnJBw8T','');
    $('#mRank').text('Rank #' +  rank);
    $('#mTAGNo').text(name);

    $('#mScore').text('Rarity Score: ' +  score.toFixed(2));
    $('#mImage').attr("src","https://cdn.tailsafterglow.io/ipfs/images" + imgTrim);

    let cbackground = "<td>Background</td><td>" + background + "</td><td>" + getOccBackground(background) + "</td><td style='text-align:right'>+" + getScoreBackground(background).toFixed(2) + "</td>";
    $('#mBackground').html(cbackground);

    let cbody = "<td>Body</td><td>" + body + "</td><td>" + getOccBody(body) + "</td><td style='text-align:right'>+" + getScoreBody(body).toFixed(2) + "</td>";
    $('#mBody').html(cbody);

    let cEyes = "<td>Eyes</td><td>" + eyes + "</td><td>" + getOccEyes(eyes) + "</td><td style='text-align:right'>+" + getScoreEyes(eyes).toFixed(2) + "</td>";
    $('#mEyes').html(cEyes);

    let cClothing = "<td>Clothing</td><td>" + clothing + "</td><td>" + getOccClothing(clothing) + "</td><td style='text-align:right'>+" + getScoreClothing(clothing).toFixed(2) + "</td>";
    $('#mClothing').html(cClothing);

    let cEyepiece = "<td>Eyepiece</td><td>" + eyepiece + "</td><td>" + getOccEyepiece(eyepiece) + "</td><td style='text-align:right'>+" + getScoreEyepiece(eyepiece).toFixed(2) + "</td>";
    $('#mEyepiece').html(cEyepiece);

    let cMouthpiece = "<td>Mouthpiece</td><td>" + mouthpiece + "</td><td>" + getOccMouthpiece(mouthpiece) + "</td><td style='text-align:right'>+" + getScoreMouthpiece(mouthpiece).toFixed(2) + "</td>";
    $('#mMouthpiece').html(cMouthpiece);

    let cHeadwear = "<td>Headwear</td><td>" + headwear + "</td><td>" + getOccHeadwear(headwear) + "</td><td style='text-align:right'>+" + getScoreHeadwear(headwear).toFixed(2) + "</td>";
    $('#mHeadwear').html(cHeadwear);

    let cSet = "<td>Set</td><td>" + set + "</td><td>" + getOccSet(set) + "</td><td style='text-align:right'>+" + getScoreSet(set).toFixed(2) + "</td>";
    $('#mSet').html(cSet);

   
    let TAGNo = name.split("#");
    let opensealink = 'https://opensea.io/assets/matic/0xe7b94a3208111a595a27634ca68d2210e674a7e6/' + TAGNo[1];

    $('#opensealink').attr('href', opensealink);

    //console.log(score);
    $('#TAGModal').modal('show');
}



//RARITY SCORE
function calculateRarityScore(Background, Body, Eyes, Clothing, Eyepiece, Mouthpiece, Headwear, Set){
    
    
    var p_background = getScoreBackground(Background);
    var p_body = getScoreBody(Body);
    var p_Eyes = getScoreEyes(Eyes);
    var p_Clothing = getScoreClothing(Clothing);
    var p_Eyepiece = getScoreEyepiece(Eyepiece);
    var p_Mouthpiece = getScoreMouthpiece(Mouthpiece);
    var p_Headwear = getScoreHeadwear(Headwear);
    var p_Set = getScoreSet(Set);

    var totalScore = 0;
    totalScore = p_background + p_body + p_Eyes + p_Clothing + p_Eyepiece + p_Mouthpiece + p_Headwear + p_Set;

    return totalScore;
}



function loadRarityTraits(){
    
    BackgroundTraits.push(new TAGTraits('RDG',1555.40,'4/0.06%'));
    BackgroundTraits.push(new TAGTraits('Grey',5.14,'821/19.47%'));
    BackgroundTraits.push(new TAGTraits('Sky_Blue',5.09,'840/19.66%'));
    BackgroundTraits.push(new TAGTraits('Magenta',4.99,'868/20.06%'));
    BackgroundTraits.push(new TAGTraits('Teal',4.91,'876/20.37%'));
    BackgroundTraits.push(new TAGTraits('Daffodil Yellow',4.91,'857/20.38%'));

    BodyTraits.push(new TAGTraits('Fur of Dread',39.08,'111/2.56%'));
    BodyTraits.push(new TAGTraits('Ember',38.31,'110/2.61%'));
    BodyTraits.push(new TAGTraits('Unusual Canine',13.39,'326/7.47%'));
    BodyTraits.push(new TAGTraits('Tinfur',12.21,'359/8.19%'));
    BodyTraits.push(new TAGTraits('Haunted',12.19,'365/8.20%'));
    BodyTraits.push(new TAGTraits('Nobility',7.43,'566/13.45%'));
    BodyTraits.push(new TAGTraits('Woodland Explorer',7.35,'580/13.60%'));
    BodyTraits.push(new TAGTraits('Rosy Coat',6.93,'599/14.43%'));
    BodyTraits.push(new TAGTraits('Night Hunter', 6.79,'610/14.72%'));
    BodyTraits.push(new TAGTraits('Tundra Roamer',6.77,'640/14.76%'));

    EyesTraits.push(new TAGTraits('Eyes of the Void',37.57,'207/2.66%'));
    EyesTraits.push(new TAGTraits('Burning Passion',36.00,'216/2.78%'));
    EyesTraits.push(new TAGTraits('Love Hungry',12.56,'619/7.96%'));
    EyesTraits.push(new TAGTraits('Battleworn Fighter',11.75,'662/8.51%'));
    EyesTraits.push(new TAGTraits('Risen Undead',11.75,'662/8.51%'));
    EyesTraits.push(new TAGTraits('Furious Fox',7.43,'1,047/13.46%'));
    EyesTraits.push(new TAGTraits('Classic RDG',7.28,'1,069/13.75%'));
    EyesTraits.push(new TAGTraits('Beseeching',7.21,'1,078/13.86%'));
    EyesTraits.push(new TAGTraits('Lashes on Fleek',7.19,'1,081/13.90%'));
    EyesTraits.push(new TAGTraits('Unambitious',6.85,'1,136/14.61%'));

    ClothingTraits.push(new TAGTraits('Overlord of the East',41.81,'186/2.39%'));
    ClothingTraits.push(new TAGTraits('RDG Varsity Jacket',37.57,'207/2.66%'));
    ClothingTraits.push(new TAGTraits('Shine Bright',19.06,'408/5.25%'));
    ClothingTraits.push(new TAGTraits('Barely Surviving',16.87,'461/5.93%'));
    ClothingTraits.push(new TAGTraits('War Never Changes',16.72,'465/5.98%'));
    ClothingTraits.push(new TAGTraits('Comfy and Casual',8.19,'949/12.20%'));
    ClothingTraits.push(new TAGTraits('Ready for Flight',8.03,'969/12.46%'));
    ClothingTraits.push(new TAGTraits('Fashionista',7.91,'983/12.64%'));
    ClothingTraits.push(new TAGTraits('Im On Vacation',7.90,'984/12.65%'));
    ClothingTraits.push(new TAGTraits('Ride On',7.56,'1,029/13.23%'));
    ClothingTraits.push(new TAGTraits('none',6.85,'1,136/14.61%'));

    EyepieceTraits.push(new TAGTraits('Tasteful Neon',40.72,'191/2.46%'));
    EyepieceTraits.push(new TAGTraits('Visi Wave'	,34.72,'224/2.88%'));
    EyepieceTraits.push(new TAGTraits('VR Headset',17.02,'457/5.88%'));
    EyepieceTraits.push(new TAGTraits('Partially Blind',16.41,'474/6.09%'));
    EyepieceTraits.push(new TAGTraits('Going Up',15.81,'492/6.33%'));
    EyepieceTraits.push(new TAGTraits('Distinguished',8.34,'932/11.98%'));
    EyepieceTraits.push(new TAGTraits('Dimensional Specs',8.21,'947/12.18%'));
    EyepieceTraits.push(new TAGTraits('Good Heavens',8.14,'955/12.28%'));
    EyepieceTraits.push(new TAGTraits('Get to Partyin',8.03,'968/12.45%'));
    EyepieceTraits.push(new TAGTraits('Day in the Beach',8.01,'971/12.49%'));
    EyepieceTraits.push(new TAGTraits('none',6.67,'1,166/14.99%'));

    MouthpieceTraits.push(new TAGTraits('Desecrated Souls',42.73,'182/2.34%'));
    MouthpieceTraits.push(new TAGTraits('Fox of the Underworld',41.81,'186/2.39%'));
    MouthpieceTraits.push(new TAGTraits('Where Did You Get That',16.91,'460/5.91%'));
    MouthpieceTraits.push(new TAGTraits('Posh',16.20,'480/6.17%'));
    MouthpieceTraits.push(new TAGTraits('Fangs Out',15.90,'489/6.29%'));
    MouthpieceTraits.push(new TAGTraits('Youngin',8.56,'909/11.69%'));
    MouthpieceTraits.push(new TAGTraits('Cigarette',8.26,'942/12.11%'));
    MouthpieceTraits.push(new TAGTraits('Sticky Situation',7.92,'982/12.63%'));
    MouthpieceTraits.push(new TAGTraits('Swirly ol Chap',7.86,'990/12.73%'));
    MouthpieceTraits.push(new TAGTraits('Playfully Licky',7.85,'991/12.74%'));
    MouthpieceTraits.push(new TAGTraits('none',6.67,'1,166/14.99%'));

    HeadwearTraits.push(new TAGTraits('Eldritch God',41.37,'188/2.42%'));
    HeadwearTraits.push(new TAGTraits('Oni Kasa',38.31,'203/2.61%'));
    HeadwearTraits.push(new TAGTraits('Conquer the Skies',16.41,'474/6.09%'));
    HeadwearTraits.push(new TAGTraits('Gentle Lights',16.34,'476/6.12%'));
    HeadwearTraits.push(new TAGTraits('Bullet Head',16.24,'479/6.16%'));
    HeadwearTraits.push(new TAGTraits('Spikes and Stuff',8.21,'947/12.18%'));
    HeadwearTraits.push(new TAGTraits('Neon Bucket',8.13,'956/12.29%'));
    HeadwearTraits.push(new TAGTraits('Beany Beanie',8.12,'958/12.32%'));
    HeadwearTraits.push(new TAGTraits('Mix Master',8.00,'972/12.50%'));
    HeadwearTraits.push(new TAGTraits('High Peak',7.83,'993/12.77%'));
    HeadwearTraits.push(new TAGTraits('none',6.88,'1,131/14.54%'));

    SetTraits.push(new TAGTraits('Damned Abomination',4266.00,'1/0.01%'));
    SetTraits.push(new TAGTraits('Flaming Black Rose',4266.00,'1/0.01%'));
    SetTraits.push(new TAGTraits('From the Grave',4266.00,'1/0.01%'));
    SetTraits.push(new TAGTraits('Hog',4266.00,'1/0.01%'));
    SetTraits.push(new TAGTraits('Medal Holder',4266.00,'1/0.01%'));
    SetTraits.push(new TAGTraits('none',1.00,'7,772/99.94%'));

}
//RARITY SCORE TRAITS

//background


function getScoreBackground(value){
    for(var i=0; i < BackgroundTraits.length; i++){
        if(BackgroundTraits[i]["traitname"] == value.replace(/['"]+/g, ''))
        {
            return BackgroundTraits[i]["score"];
        }
    }

}
//end background

//body
function getScoreBody(value){
    for(var i=0; i < BodyTraits.length; i++){
        if(BodyTraits[i]["traitname"] == value.replace(/['"]+/g, ''))
        {
            return BodyTraits[i]["score"];
        }
    }
    
}
//end body

//eyes
function getScoreEyes(value){

    for(var i=0; i < EyesTraits.length; i++){
        if(EyesTraits[i]["traitname"] == value.replace(/['"]+/g, ''))
        {
            return EyesTraits[i]["score"];
        }
    }

}
//end eyes

//clothing
function getScoreClothing(value){

    for(var i=0; i < ClothingTraits.length; i++){
        if(ClothingTraits[i]["traitname"] == value.replace(/['"]+/g, ''))
        {
            return ClothingTraits[i]["score"];
        }
    }

   
}
//end clothing

//eyepiece
function getScoreEyepiece(value){
    for(var i=0; i < EyepieceTraits.length; i++){
        if(EyepieceTraits[i]["traitname"] == value.replace(/['"]+/g, ''))
        {
            return EyepieceTraits[i]["score"];
        }
    }
}
//end eyepiece

//mouthpiece
function getScoreMouthpiece(value){

    for(var i=0; i < MouthpieceTraits.length; i++){
        if(MouthpieceTraits[i]["traitname"] == value.replace(/['"]+/g, ''))
        {
            return MouthpieceTraits[i]["score"];
        }
    }
}
//end mouthpiece

//headwear
function getScoreHeadwear(value){
    for(var i=0; i < HeadwearTraits.length; i++){
        if(HeadwearTraits[i]["traitname"] == value.replace(/['"]+/g, ''))
        {
            return HeadwearTraits[i]["score"];
        }
    }
    
}
//end headwear

//set
function getScoreSet(value){

    for(var i=0; i < SetTraits.length; i++){
        if(SetTraits[i]["traitname"] == value.replace(/['"]+/g, ''))
        {
            return SetTraits[i]["score"];
        }
    }
}
//end Set
//END RARITY SCORE


//RARITY OCCURENCE TRAITS

//background
function getOccBackground(value){

    for(var i=0; i < BackgroundTraits.length; i++){
        if(BackgroundTraits[i]["traitname"] == value.replace(/['"]+/g, ''))
        {
            return BackgroundTraits[i]["occurence"];
        }
    }
    
}
//end background

//body
function getOccBody(value){
    for(var i=0; i < BodyTraits.length; i++){
        if(BodyTraits[i]["traitname"] == value.replace(/['"]+/g, ''))
        {
            return BodyTraits[i]["occurence"];
        }
    }
    

}
//end body

//eyes
function getOccEyes(value){
    for(var i=0; i < EyesTraits.length; i++){
        if(EyesTraits[i]["traitname"] == value.replace(/['"]+/g, ''))
        {
            return EyesTraits[i]["occurence"];
        }
    }

    
}
//end eyes

//clothing
function getOccClothing(value){

    for(var i=0; i < ClothingTraits.length; i++){
        if(ClothingTraits[i]["traitname"] == value.replace(/['"]+/g, ''))
        {
            return ClothingTraits[i]["occurence"];
        }
    }

    
}
//end clothing

//eyepiece
function getOccEyepiece(value){

    for(var i=0; i < EyepieceTraits.length; i++){
        if(EyepieceTraits[i]["traitname"] == value.replace(/['"]+/g, ''))
        {
            return EyepieceTraits[i]["occurence"];
        }
    }
}
//end eyepiece

//mouthpiece
function getOccMouthpiece(value){

    for(var i=0; i < MouthpieceTraits.length; i++){
        if(MouthpieceTraits[i]["traitname"] == value.replace(/['"]+/g, ''))
        {
            return MouthpieceTraits[i]["occurence"];
        }
    }
}
//end mouthpiece

//headwear
function getOccHeadwear(value){

    for(var i=0; i < HeadwearTraits.length; i++){
        if(HeadwearTraits[i]["traitname"] == value.replace(/['"]+/g, ''))
        {
            return HeadwearTraits[i]["occurence"];
        }
    }
}
//end headwear

//set
function getOccSet(value){
    for(var i=0; i < SetTraits.length; i++){
        if(SetTraits[i]["traitname"] == value.replace(/['"]+/g, ''))
        {
            return SetTraits[i]["occurence"];
        }
    }
    
}
//end Set
//END RARITY OCCURENCE

function TAGTraits(ctraitname, cscore, coccurence)
{
    this.traitname = ctraitname;
    this.score = cscore;
    this.occurence = coccurence;
}

function TAGNFT(cname, cimage, cscore, 
    cbackground,
    cbody, 
    ceyes,
    cclothing,
    ceyepiece,
    cmouthpiece,
    cheadwear,
    cset)
{
        this.name = cname;
        this.image = cimage;
        this.score = cscore;
        
        this.background = cbackground;
        this.body = cbody;
        this.eyes = ceyes;
        this.clothing = cclothing;
        this.eyepiece = ceyepiece;
        this.mouthpiece = cmouthpiece;
        this.headwear = cheadwear;
        this.set = cset;
       
}

function compareValues(key, order = 'asc') {
    return function innerSort(a, b) {
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        // property doesn't exist on either object
        return 0;
      }
  
      const varA = (typeof a[key] === 'string')
        ? a[key].toUpperCase() : a[key];
      const varB = (typeof b[key] === 'string')
        ? b[key].toUpperCase() : b[key];
  
      let comparison = 0;
      if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      }
      return (
        (order === 'desc') ? (comparison * -1) : comparison
      );
    };
  }


  function SearchTAG()
  {
     
      $('#btnloadmore').hide();
      $(":checkbox").prop('checked', false);
      let val = $('#tSearch').val();
      
      if(val != "")
    {
      let NFTs = [];
      loadRarityTraits();
      //console.log(BackgroundTraits);

    $.getJSON("assets/data/_metadata.json",
    
    function (data) {
       
        
        $.each(data, function (key, value) {
            
            let name = value.name;
            
                
                let imageurl = value.image;

                let vbackground = JSON.stringify(value.attributes[0]["value"]);
                let vbody = JSON.stringify(value.attributes[1]["value"]);
                let veyes = JSON.stringify(value.attributes[2]["value"]);
                let vclothing = JSON.stringify(value.attributes[3]["value"]);
                let veyepiece = JSON.stringify(value.attributes[4]["value"]);
                let vmouthpiece = JSON.stringify(value.attributes[5]["value"]);
                let vheadwear = JSON.stringify(value.attributes[6]["value"]);
                let vset = JSON.stringify(value.attributes[7]["value"]);
                
                let score = calculateRarityScore(vbackground,vbody,veyes, vclothing,veyepiece,vmouthpiece,vheadwear,vset);

                    NFTs.push(new TAGNFT(name,imageurl,score, 
                        vbackground,
                        vbody,
                        veyes,
                        vclothing,
                        veyepiece,
                        vmouthpiece,
                        vheadwear,
                        vset));
        });
        $('#content').html('');
        $('#loading').html('');

        let sortNFT = NFTs.sort((a, b) => parseFloat(b.score) - parseFloat(a.score));
        loadContent(sortNFT, 0, tcount, "byTagNo",val,'asc');
    });
    }
    else{
        reset('asc');
    }
  }


  function checkAllcheckboxesSet()
  {
    for(var i=0; i < SetTraits.length; i++){
        if($('#set_' + SetTraits[i]["traitname"].replace(/ /g,"_")).is(":checked"))
        {
            return true;
        }
    }
    return false;
  }
  function checkAllcheckboxesHeadwear()
  {
    for(var i=0; i < HeadwearTraits.length; i++){
        if($('#headwear_' + HeadwearTraits[i]["traitname"].replace(/ /g,"_")).is(":checked"))
        {
            return true;
        }
    }
    return false;
  }

  function checkAllcheckboxesMouthpiece()
  {
    for(var i=0; i < MouthpieceTraits.length; i++){
        if($('#mouthpiece_' + MouthpieceTraits[i]["traitname"].replace(/ /g,"_")).is(":checked"))
        {
            return true;
        }
    }
    return false;
  }

  function checkAllcheckboxesEyepiece()
  {
    for(var i=0; i < EyepieceTraits.length; i++){
        if($('#eyepiece_' + EyepieceTraits[i]["traitname"].replace(/ /g,"_")).is(":checked"))
        {
            return true;
        }
    }
    return false;
  }
  function checkAllcheckboxesClothing()
  {
    for(var i=0; i < ClothingTraits.length; i++){
        if($('#clothing_' + ClothingTraits[i]["traitname"].replace(/ /g,"_")).is(":checked"))
        {
            return true;
        }
    }
    return false;
  }
  function checkAllcheckboxesEyes()
  {
    for(var i=0; i < EyesTraits.length; i++){
        if($('#eyes_' + EyesTraits[i]["traitname"].replace(/ /g,"_")).is(":checked"))
        {
            return true;
        }
    }
    return false;
  }
  function checkAllcheckboxesBody()
  {
    for(var i=0; i < BodyTraits.length; i++){
        if($('#body_' + BodyTraits[i]["traitname"].replace(/ /g,"_")).is(":checked"))
        {
            return true;
        }
    }
    return false;
  }

  function checkAllcheckboxesBackground()
 {
    for(var i=0; i < BackgroundTraits.length; i++){
            if($('#background_' + BackgroundTraits[i]["traitname"].replace(/ /g,"_")).is(":checked"))
            {
                return true;
            }
        }
    return false;

 }

  function checkiffiltered(trait, traitname) {
    if(trait == 'Background')
    {
        
        for(var i=0; i < BackgroundTraits.length; i++){
            if(traitname.replace(/['"]+/g, '') == BackgroundTraits[i]["traitname"] && $('#background_' + BackgroundTraits[i]["traitname"].replace(/ /g,"_")).is(":checked"))
            {
                return true;
            }
        }
        
    }

    if(trait == 'Body')
    {
        for(var i=0; i < BodyTraits.length; i++){
            if(traitname.replace(/['"]+/g, '') == BodyTraits[i]["traitname"] && $('#body_' + BodyTraits[i]["traitname"].replace(/ /g,"_")).is(":checked"))
            {
                return true;
                
            }
            
        }
        
    }
    if(trait == 'Eyes')
    {
        for(var i=0; i < EyesTraits.length; i++){
            if(traitname.replace(/['"]+/g, '') == EyesTraits[i]["traitname"] && $('#eyes_' + EyesTraits[i]["traitname"].replace(/ /g,"_")).is(":checked"))
            {
                return true;
            }
        }
        
    }
    if(trait == 'Clothing')
    {
        for(var i=0; i < ClothingTraits.length; i++){
            if(traitname.replace(/['"]+/g, '') == ClothingTraits[i]["traitname"] && $('#clothing_' + ClothingTraits[i]["traitname"].replace(/ /g,"_")).is(":checked"))
            {
                return true;
            }
        }
        
    }
    if(trait == 'Eyepiece')
    {
        for(var i=0; i < EyepieceTraits.length; i++){
            if(traitname.replace(/['"]+/g, '') == EyepieceTraits[i]["traitname"] && $('#eyepiece_' + EyepieceTraits[i]["traitname"].replace(/ /g,"_")).is(":checked"))
            {
                return true;
            }
        }
        
    }
    if(trait == 'Mouthpiece')
    {
        for(var i=0; i < MouthpieceTraits.length; i++){
            if(traitname.replace(/['"]+/g, '') == MouthpieceTraits[i]["traitname"] && $('#mouthpiece_' + MouthpieceTraits[i]["traitname"].replace(/ /g,"_")).is(":checked"))
            {
                return true;
            }
        }
        
    }
    if(trait == 'Headwear')
    {
        for(var i=0; i < HeadwearTraits.length; i++){
            if(traitname.replace(/['"]+/g, '') == HeadwearTraits[i]["traitname"] && $('#headwear_' + HeadwearTraits[i]["traitname"].replace(/ /g,"_")).is(":checked"))
            {
                return true;
            }
        }
        
    }
    if(trait == 'Set')
    {
        for(var i=0; i < SetTraits.length; i++){
            if(traitname.replace(/['"]+/g, '') == SetTraits[i]["traitname"] && $('#set_' + SetTraits[i]["traitname"].replace(/ /g,"_")).is(":checked"))
            {
                return true;
            }
        }
        
    }

    return false;
  }

  function clearFilters()
  {
    //console.log('qwe');
    $(":checkbox").prop('checked', false);
    reset('asc');
  }

  function filtertraits() {

    reset('asc');

  }

  function loadFilters() {
    
    var background = '';
    for(var i=0; i < BackgroundTraits.length; i++){
        
        background = background + '<div class="form-check">' +
                                   '<input class="form-check-input"  onclick="filtertraits(\'asc\')" type="checkbox" id="background_' + BackgroundTraits[i]["traitname"].replace(/ /g,"_") + '">' +
                                   '<label class="form-check-label desSize" for="background_' + BackgroundTraits[i]["traitname"] + '">' + BackgroundTraits[i]["traitname"]  + ' (' + BackgroundTraits[i]["occurence"] + ')</label>' +
                                    '</div>';
    }
    $('#fBackground').html(background);

    var body = '';
    for(var i=0; i < BodyTraits.length; i++){
        
        body = body + '<div class="form-check">' +
                                   '<input class="form-check-input"  onclick="filtertraits(\'asc\')" type="checkbox" id="body_' + BodyTraits[i]["traitname"].replace(/ /g,"_") + '">' +
                                   '<label class="form-check-label desSize" for="body_' + BodyTraits[i]["traitname"] + '">' + BodyTraits[i]["traitname"]  + ' (' + BodyTraits[i]["occurence"] + ')</label>' +
                                    '</div>';
    }
    
    $('#fBody').html(body);

    var eyes = '';
    for(var i=0; i < EyesTraits.length; i++){
        
        eyes = eyes + '<div class="form-check">' +
                                   '<input class="form-check-input"  onclick="filtertraits(\'asc\')" type="checkbox" id="eyes_' + EyesTraits[i]["traitname"].replace(/ /g,"_") + '">' +
                                   '<label class="form-check-label desSize" for="eyes_' + EyesTraits[i]["traitname"] + '">' + EyesTraits[i]["traitname"]  + ' (' + EyesTraits[i]["occurence"] + ')</label>' +
                                    '</div>';
    }
    $('#fEyes').html(eyes);

    
    var clothing = '';
    for(var i=0; i < ClothingTraits.length; i++){   
        clothing = clothing + '<div class="form-check">' +
                                   '<input class="form-check-input"  onclick="filtertraits(\'asc\')" type="checkbox" id="clothing_' + ClothingTraits[i]["traitname"].replace(/ /g,"_") + '">' +
                                   '<label class="form-check-label desSize" for="clothing_' + ClothingTraits[i]["traitname"] + '">' + ClothingTraits[i]["traitname"]  + ' (' + ClothingTraits[i]["occurence"] + ')</label>' +
                                    '</div>';
    }
    $('#fClothing').html(clothing);

    var eyepiece = '';
    for(var i=0; i < EyepieceTraits.length; i++){   
        eyepiece = eyepiece + '<div class="form-check">' +
                                   '<input class="form-check-input"  onclick="filtertraits(\'asc\')" type="checkbox" id="eyepiece_' + EyepieceTraits[i]["traitname"].replace(/ /g,"_") + '">' +
                                   '<label class="form-check-label desSize" for="eyepiece_' + EyepieceTraits[i]["traitname"] + '">' + EyepieceTraits[i]["traitname"]  + ' (' + EyepieceTraits[i]["occurence"] + ')</label>' +
                                    '</div>';
    }
    $('#fEyepiece').html(eyepiece);

    var mouthpiece = '';
    for(var i=0; i < MouthpieceTraits.length; i++){   
        mouthpiece = mouthpiece + '<div class="form-check">' +
                                   '<input class="form-check-input"  onclick="filtertraits(\'asc\')" type="checkbox" id="mouthpiece_' + MouthpieceTraits[i]["traitname"].replace(/ /g,"_") + '">' +
                                   '<label class="form-check-label desSize" for="mouthpiece_' + MouthpieceTraits[i]["traitname"] + '">' + MouthpieceTraits[i]["traitname"]  + ' (' + MouthpieceTraits[i]["occurence"] + ')</label>' +
                                    '</div>';
    }
    $('#fMouthpiece').html(mouthpiece);

    var headwear = '';
    for(var i=0; i < HeadwearTraits.length; i++){   
        headwear = headwear + '<div class="form-check">' +
                                   '<input class="form-check-input"  onclick="filtertraits(\'asc\')" type="checkbox" id="headwear_' + HeadwearTraits[i]["traitname"].replace(/ /g,"_") + '">' +
                                   '<label class="form-check-label desSize" for="headwear_' + HeadwearTraits[i]["traitname"] + '">' + HeadwearTraits[i]["traitname"]  + ' (' + HeadwearTraits[i]["occurence"] + ')</label>' +
                                    '</div>';
    }
    $('#fHeadwear').html(headwear);

    var set = '';
    for(var i=0; i < SetTraits.length; i++){   
        set = set + '<div class="form-check">' +
                                   '<input class="form-check-input"  onclick="filtertraits(\'asc\')" type="checkbox" id="set_' + SetTraits[i]["traitname"].replace(/ /g,"_") + '">' +
                                   '<label class="form-check-label desSize" for="set_' + SetTraits[i]["traitname"] + '">' + SetTraits[i]["traitname"]  + ' (' + SetTraits[i]["occurence"] + ')</label>' +
                                    '</div>';
    }
    $('#fSet').html(set);



  }