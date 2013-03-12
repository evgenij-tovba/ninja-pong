package com.yoc.pongcontroller;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;

import com.google.zxing.integration.android.IntentIntegrator;
import com.google.zxing.integration.android.IntentResult;

public class MainActivity extends Activity {
	public static final String EXTRAS_IP = "extras-ip";
	public static final String EXTRAS_PORT = "extras-port";
	private Button b1;

	public static final int REQUEST_CODE = 1;

	/** Called when the activity is first created. */
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_main);

		b1 = (Button) findViewById(R.id.main_button);
		b1.setText("Scan QR-Code");
		b1.setOnClickListener(new OnClickListener() {

			public void onClick(View arg0) {
				final IntentIntegrator integrator = new IntentIntegrator(
						MainActivity.this);
				integrator.initiateScan();

			}
		});
	}


	public void onActivityResult(int requestCode, int resultCode, Intent intent) {
		final IntentResult scanResult = IntentIntegrator.parseActivityResult(
				requestCode, resultCode, intent);
		if (scanResult != null) {
			// handle scan result
			final String[] result = scanResult.getContents().split(":");
			final Intent controllerIntent = new Intent(MainActivity.this,
					ControllerActivity.class);
			controllerIntent.putExtra(EXTRAS_IP, result[0]);
			controllerIntent.putExtra(EXTRAS_PORT, result[1]);
			startActivity(controllerIntent);
		}
	}

}