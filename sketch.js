var data;
var bubbles;

var years;

function preload() 
{
	data = loadTable("foodData.csv", "csv", "header");
}

function setup()
{
	var c = createCanvas(1000, 1000);
    c.parent("canvas-div");
    bubbles = [];
    
    years = [];
    
    for(var i = 5; i < data.getColumnCount(); i++){
        
        var s = data.columns[i];
        years.push(s);
        
        var b = createButton(s);
        b.parent("year-div");
        
        b.mousePressed(function(){
            var yearString = this.elt.innerHTML;
            var yearIndex = years.indexOf(yearString);
            
            for(var i = 0; i < bubbles.length; i++){
                bubbles[i].setYear(yearIndex);    
            }
            
        });
        
    }
    
    for(var i = 0; i < data.getRowCount(); i++){
        var r = data.getRow(i);
        var name = r.getString("L1");
        
        if(name != ""){
            
            var d = [];
            
            for(var j = 0; j < years.length; j++){
                var v = Number(r.get(years[j]));
                d.push(v);
            }
            
            
            var b = new Bubble(name, d);
            b.setYear(v);
            
            bubbles.push(b);

        }
       
        
    }


}


function draw() 
{
    background(100);
    
    push();
    textAlign(CENTER);
    translate(width/2,height/2);
    for(var i = 0; i < bubbles.length; i++){
        bubbles[i].updateDirection(bubbles);
        bubbles[i].draw();
        
    }
    pop();
}

function Bubble(_name, _data){
    this.name = _name;
    this.id = getRandomID();
    this.pos = createVector(0, 0);
    this.dir = createVector(0,0);
    
    this.data = _data;
    
    this.color = color(random(0,255),random(0,255),random(0,255));
    this.size = 20;
    this.target_size = this.size;
    
    this.draw = function(){
        noStroke();
        
        fill(this.color);
        ellipse(this.pos.x, this.pos.y, this.size, this.size);
        
        fill(0);
        text(this.name, this.pos.x, this.pos.y);
        
        this.pos.add(this.dir);
        
        if(this.size < this.target_size){
            this.size += 1;
        }
        else if(this.size > this.target_size){
            this.size -= 1;
        }
        
    }
    this.setYear = function(year_index){
        var v = this.data[year_index];
        this.target_size =  map(v,0,3000,5,200);
        
    }
    this.updateDirection = function(_bubbles){
        this.dir = createVector(0,0);
        for(var i = 0; i < _bubbles.length; i++){
            if(_bubbles[i].id != this.id){
                var v = p5.Vector.sub(this.pos,_bubbles[i].pos);
                var d = v.mag();
                
                if(d < this.size/2 + _bubbles[i].size/2){
                    //console.log("collisions");
                    if(d == 0){
                        this.dir.add(p5.Vector.random2D());
                        
                    }
                    else {
                        this.dir.add(v);
                    }
                    
                    
                } 
                
            }
            
        }
        this.dir.normalize();
        
    }
    
}

function getRandomID(){
    var alpha = "abcdefghijklmnopqrstuvwxyz0123456789"
    var s = "";
    for(var i = 0; i < 10; i++){
        s += alpha[floor(random(0, alpha.length))];
    }
    return s;
    
    
    
}