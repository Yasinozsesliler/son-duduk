import Capacitor
import UIKit

/// Tekrar klibini (video) sistemin paylaşım sayfasıyla paylaşır.
/// JS: registerPlugin("ClipShare").share({ data: base64, name, mime, text })
@objc(ClipSharePlugin)
public class ClipSharePlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "ClipSharePlugin"
    public let jsName = "ClipShare"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "share", returnType: CAPPluginReturnPromise)
    ]

    @objc func share(_ call: CAPPluginCall) {
        guard let b64 = call.getString("data"), let data = Data(base64Encoded: b64) else {
            call.reject("no data")
            return
        }
        let name = call.getString("name") ?? "refmania.mp4"
        let text = call.getString("text") ?? ""
        let url = FileManager.default.temporaryDirectory.appendingPathComponent(name)
        do {
            try? FileManager.default.removeItem(at: url)
            try data.write(to: url)
        } catch {
            call.reject("write failed")
            return
        }
        DispatchQueue.main.async {
            guard let vc = self.bridge?.viewController else {
                call.reject("no view")
                return
            }
            var items: [Any] = [url]
            if !text.isEmpty { items.append(text) }
            let avc = UIActivityViewController(activityItems: items, applicationActivities: nil)
            if let pop = avc.popoverPresentationController {
                pop.sourceView = vc.view
                pop.sourceRect = CGRect(x: vc.view.bounds.midX, y: vc.view.bounds.midY, width: 1, height: 1)
                pop.permittedArrowDirections = []
            }
            avc.completionWithItemsHandler = { _, completed, _, _ in
                call.resolve(["completed": completed])
            }
            vc.present(avc, animated: true)
        }
    }
}
