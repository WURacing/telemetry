//
//  TelemetryViewController.swift
//  TelemetryApp
//
//  Created by Jeff Ahlers on 11/6/19.
//  Copyright © 2019 Jeff Ahlers. All rights reserved.
//

import UIKit
import Charts

class TelemetryViewController: BaseChartViewController, TelemetryDelegate {
    
    //We need to change this so that charts maintains order with favorites and general
    //Ideally I think this should be to arrays that have matching orders to the above arrays
    var favoriteCharts: [SmallTelemetryChartView] = []
    var generalCharts: [SmallTelemetryChartView] = []
    
    var graphingQueues: [DispatchQueue] = []
    var queueIndex = 0
    let numThreads = 16
//    let graphingQueue = DispatchQueue(label: "graphingQueue", qos: .background, attributes: .concurrent)

 
    let chartUpdateFrequency: Double = 1 // seconds
    var lastTime: Date = Date()
    
    @IBOutlet weak var dockOutlet: DockManager!
    @IBOutlet var dockHeight: NSLayoutConstraint!
    @IBOutlet weak var graphView: UICollectionView!
    @IBOutlet weak var dockBlur: UIView!
    @IBOutlet weak var topViewHeight: NSLayoutConstraint!
    
    var panGesture = UIPanGestureRecognizer()
    var upwardState = false
    
    override func viewDidLoad() {
        super.viewDidLoad()
        graphView.dataSource = self
        dockOutlet.expandedView.expandedDockCollection.dataSource = self
        dockOutlet.expandedView.expandedDockCollection.delegate = self
        
        let cellNib = UINib(nibName: "DockExpandedCell", bundle: nil)
        dockOutlet.expandedView.expandedDockCollection.register(cellNib, forCellWithReuseIdentifier: "DockExpandedCell")
        graphView.register(HeaderView.self, forSupplementaryViewOfKind: UICollectionView.elementKindSectionHeader, withReuseIdentifier: "myView")
        dockOutlet.setUp(dockOutlet.minimizedView)
        panGesture = UIPanGestureRecognizer(target: self, action: #selector(TelemetryViewController.draggedView(_:)))
        
        dockOutlet.isUserInteractionEnabled = true
        dockOutlet.addGestureRecognizer(panGesture)
        dockOutlet.roundCorners(cornerRadius: 12.5)
        
        for i in 0..<numThreads {
            graphingQueues.append(DispatchQueue(label: "graphingQueue"+String(i), qos: .background, attributes: .concurrent))
        }
        
        updateChartData()
        
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        
        Telemetry.shared.delegate = self
        
        updateChartData()
    }
    
    
    func manageMessage(key: String, dataPoint: DataPoint) {
        let sensor = Sensor(key: key)
        let section = (Telemetry.shared.getFavoriteSensors().contains(sensor) ? 0:1)
        let row = (section == 0 ? Telemetry.shared.getFavoriteSensors().firstIndex(of: sensor):Telemetry.shared.getGeneralSensors().firstIndex(of: sensor)) ?? 0
        let indexPath = IndexPath(row: row, section: section)
        
        if(upwardState){
            
            dockOutlet.expandedView.expandedDockCollection.reloadItems(at: [indexPath])
            
        }else{
            
            let now = Date()
            
            if abs(now.timeIntervalSince(lastTime)) > chartUpdateFrequency {
                updateChartData()
                lastTime = now
            }
        }
    }
    func manageOpen() {
        
    }
    
    func manageComplete() {
        
    }
    
    func newSensor(sensor: Sensor) {
        let chart = SmallTelemetryChartView(frame: .zero)
        chart.setUp(key: sensor.key)
        chart.delegate = self
        updateChartData(chart: chart)
        if Telemetry.shared.getGeneralSensors().contains(sensor) {
            generalCharts.append(chart)
        } else {
            favoriteCharts.append(chart)
        }
        graphView.reloadData()
    }
    
    override func updateChartData() {
        graphingQueues[queueIndex].sync {
        
            for chart in self.favoriteCharts {
                self.updateChartData(chart: chart)
            }
            
            for chart in self.generalCharts {
                self.updateChartData(chart: chart)
            }
        }
        queueIndex += 1
        if queueIndex == numThreads {
            queueIndex = 0
        }
    }
}


