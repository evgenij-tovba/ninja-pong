package com.yoc.pongcontroller;

import java.io.IOException;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.net.SocketException;
import java.net.UnknownHostException;
import java.nio.ByteBuffer;

import android.util.Log;

public class UDPPacketSender {
	private static int counter = 0;
	private Thread mThread;
	private volatile boolean mThreadRunning = true;
	private volatile boolean mPositionChanged = false;
	private volatile int mPosition;
	private static final String LOG_TAG = "PongController.UDPPacketSender";
	private InetAddress mIP;
	private int mPort;
	private DatagramSocket mSocket;

	public void setPosition(int position) {
		mPosition = position;
		mPositionChanged = true;
	}

	public UDPPacketSender(final String ip, final int port){
		try {
			mIP =InetAddress.getByName(ip);
		} catch (UnknownHostException e) {
			Log.e(LOG_TAG, "error in ip: " + e);
			e.printStackTrace();
		}
		mPort = port;
		
	}
	
	public void initializeSocketThread(){
		try {
			mSocket = new DatagramSocket();
			mThread = new Thread() {
				public void run() {
					while (mThreadRunning) {
						if(mPositionChanged){
							sendPosition();
							mPositionChanged = false;
						}
					}
				};
			};
			mThread.start();
		} catch (SocketException e) {
			Log.e(LOG_TAG, "error in initializing socket: " + e);
			e.printStackTrace();
		}
	}
	
	private void sendPosition() {
		Log.d(LOG_TAG, "sendPosition(): " + mPosition);
		final byte messageType = 0x03;
		final byte[] intAsBytes = ByteBuffer.allocate(4).putInt(mPosition)
				.array();
		// final byte[] counterAsBytes =
		// ByteBuffer.allocate(4).putInt(counter++)
		// .array();
		final byte[] bytesToSend = new byte[intAsBytes.length + 1];
		bytesToSend[0] = messageType;
		for (int i = 0; i < intAsBytes.length; i++) {
			bytesToSend[i + 1] = intAsBytes[i];
		}
		// for (int i = 0; i < counterAsBytes.length; i++) {
		// bytesToSend[i + intAsBytes.length + 1] = counterAsBytes[i];
		// }
		// Initialize a datagram packet with data and address
		final DatagramPacket packet = new DatagramPacket(bytesToSend,
				bytesToSend.length, mIP, mPort);
		try {
			mSocket.send(packet);
		} catch (IOException e) {
			Log.e(LOG_TAG, "error while sending packet: " + e);
			e.printStackTrace();
		}

	}
	
	public void closeSocket(){
		mThreadRunning = false;
		mSocket.close();
	}
}