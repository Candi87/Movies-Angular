import { Component, OnInit, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ChartData, ChartType } from 'chart.js';
import { ChartEvent } from 'chart.js/dist/core/core.plugins';
import { tap } from 'rxjs';
import { ComponentsService } from '../services/components.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit  {



  public API_IMG_URL ="https://image.tmdb.org/t/p/w500/"
  @ViewChildren('theLastList', { read: ElementRef })
  theLastList?: QueryList<ElementRef>

  

  public formGroup!: FormGroup;
  public isAdult?:boolean;
  private observer: any;
  public seriesA: any = [];
  public paginator: any = []
  public totalPages!: number;
  public currentPage: number = 1;
  public certifications?: any;
  public age: any;
  public adult: any;
  public idFilms: any = [];

  public esAconsejable?:boolean;
  public edadPublicos: any = [];
  public apta:any = [];

  constructor(
    private comoponentService: ComponentsService,
    private formBuilder: FormBuilder
   ) {

  }

  ngOnInit():void {
    this.formGroup = this.initForm();
    this.intersectionObserver();
    this.getMostPupolarFilms();
  }

  initForm(): FormGroup {
    return this.formGroup = this.formBuilder.group({
      date: ['', Validators.required],
    });
  }



  onClick() {
    let fecha = this.formGroup.value.date;
    fecha = new Date(fecha);
    let actualDate = new Date().getFullYear()
    const year = fecha?.getFullYear();
  
    if(actualDate-18 > year) {
      this.adult = true;
    } else {
      this.adult = false;
    }
  }

  restartSession() {
    this.formGroup = new FormGroup ({
      date: new FormControl (['', Validators.required]),
    })
    this.adult = false;
  }


  ngAfterViewInit() {
    this.theLastList?.changes
      .subscribe((d)=> {
        if(d.last) this.observer.observe(d.last.nativeElement) 
      });
    
  }

  public intersectionObserver() {
    let options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
    };
  
    this.observer = new IntersectionObserver((entries) =>{
      if(entries[0].isIntersecting) {
        if(this.currentPage < this.totalPages) {
          this.currentPage++;
          this.getMostPupolarFilms();
          this.getBetterFilmsFilter();
        }        
      }
    }, options);

  }

  getBetterFilmsFilter() {
    let i = 0;
    this.comoponentService.getMostPupolarFilms$(this.currentPage)
    .subscribe(( data: any) => {
      this.totalPages = data.total_pages;
      data.results.forEach((element: any) => {
        this.seriesA.push(element)            
      })
      for ( i = 0; i < this.seriesA.length; i++) {
        this.idFilms = this.seriesA[i];       
        this.comoponentService.getCertifications$(this.idFilms.id)
        .subscribe((data: any ) => {
          this.certifications = data.results.findIndex((certification: {iso_3166_1: string }) => certification.iso_3166_1 === 'ES');
          this.age = data.results[this.certifications]?.release_dates[0]
          this.edadPublicos.push(data.results[this.certifications]?.release_dates[0].certification)  
        })
      } 
    });
    console.log('edades',this.edadPublicos);
    console.log('series',this.seriesA);    
  }
 
  
  public getMostPupolarFilms() {
    this.comoponentService.getMostPupolarFilms$(this.currentPage)
    .subscribe(( data: any) => {
      this.totalPages = data.total_pages;    
      data.results.forEach((element: any) => {
        this.seriesA.push(element)            
      });
    });
  }
 
}
