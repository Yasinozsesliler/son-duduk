import UIKit
import Capacitor

/// Uygulamanın kendi yerel eklentilerini köprüye kaydeder.
class MainViewController: CAPBridgeViewController {
    override open func capacitorDidLoad() {
        bridge?.registerPluginInstance(InAppReviewPlugin())
    }
}
